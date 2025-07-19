const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { dbGet, dbAll, dbRun } = require('../database/db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public routes - Get all published blog posts
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT bp.*, u.username as author_name 
      FROM blog_posts bp 
      LEFT JOIN users u ON bp.author_id = u.id 
      WHERE (bp.is_published = 1 OR bp.is_published = 'true')
    `;
    let params = [];

    if (category && category !== 'all') {
      query += ' AND bp.category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (bp.title LIKE ? OR bp.content LIKE ? OR bp.excerpt LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY bp.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const posts = await dbAll(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM blog_posts WHERE is_published = 1';
    let countParams = [];

    if (category && category !== 'all') {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await dbGet(countQuery, countParams);
    const totalPosts = countResult.total;
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts: posts.map(post => ({
        ...post,
        tags: post.tags ? post.tags.split(',') : []
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching blog posts' });
  }
});

// Public route - Get single blog post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await dbGet(`
      SELECT bp.*, u.username as author_name 
      FROM blog_posts bp 
      LEFT JOIN users u ON bp.author_id = u.id 
      WHERE bp.id = ? AND (bp.is_published = 1 OR bp.is_published = 'true')
    `, [id]);

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({
      ...post,
      tags: post.tags ? post.tags.split(',') : []
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Error fetching blog post' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await dbAll(`
      SELECT DISTINCT category, COUNT(*) as count 
      FROM blog_posts 
      WHERE (is_published = 1 OR is_published = 'true')
      GROUP BY category 
      ORDER BY category
    `);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// Admin routes - require authentication
// Get all posts (including unpublished) for admin
router.get('/admin/posts', verifyToken, requireAdmin, async (req, res) => {
  try {
    const posts = await dbAll(`
      SELECT bp.*, u.username as author_name 
      FROM blog_posts bp 
      LEFT JOIN users u ON bp.author_id = u.id 
      ORDER BY bp.created_at DESC
    `);

    res.json(posts.map(post => ({
      ...post,
      tags: post.tags ? post.tags.split(',') : []
    })));
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Create new blog post
router.post('/admin/posts', verifyToken, requireAdmin, upload.single('featured_image'), async (req, res) => {
  try {
    const { title, content, excerpt, category = 'general', tags, is_published = true } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const featured_image = req.file ? `/uploads/${req.file.filename}` : null;
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags || '';
    
    // Handle all possible forms of is_published value
    let publishedValue = 0;
    if (is_published === true || is_published === 'true' || is_published === '1' || is_published === 1 || is_published === 'on') {
      publishedValue = 1;
    }

    const result = await dbRun(`
      INSERT INTO blog_posts (title, content, excerpt, featured_image, category, tags, is_published, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, content, excerpt, featured_image, category, tagsString, publishedValue, req.user.id]);

    const newPost = await dbGet('SELECT * FROM blog_posts WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Blog post created successfully',
      post: {
        ...newPost,
        tags: newPost.tags ? newPost.tags.split(',') : []
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating blog post' });
  }
});

// Update blog post
router.put('/admin/posts/:id', verifyToken, requireAdmin, upload.single('featured_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category, tags, is_published } = req.body;

    // Check if post exists
    const existingPost = await dbGet('SELECT * FROM blog_posts WHERE id = ?', [id]);
    if (!existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const featured_image = req.file 
      ? `/uploads/${req.file.filename}` 
      : existingPost.featured_image;

    const tagsString = Array.isArray(tags) ? tags.join(',') : tags || '';
    
    // Handle all possible forms of is_published value
    let publishedValue = 0;
    if (is_published === true || is_published === 'true' || is_published === '1' || is_published === 1 || is_published === 'on') {
      publishedValue = 1;
    }

    await dbRun(`
      UPDATE blog_posts 
      SET title = ?, content = ?, excerpt = ?, featured_image = ?, category = ?, tags = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, content, excerpt, featured_image, category, tagsString, publishedValue, id]);

    const updatedPost = await dbGet('SELECT * FROM blog_posts WHERE id = ?', [id]);

    res.json({
      message: 'Blog post updated successfully',
      post: {
        ...updatedPost,
        tags: updatedPost.tags ? updatedPost.tags.split(',') : []
      }
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Error updating blog post' });
  }
});

// Delete blog post
router.delete('/admin/posts/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await dbGet('SELECT * FROM blog_posts WHERE id = ?', [id]);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Delete associated image file
    if (post.featured_image) {
      const imagePath = path.join(__dirname, '..', post.featured_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await dbRun('DELETE FROM blog_posts WHERE id = ?', [id]);

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error deleting blog post' });
  }
});

// Upload image endpoint
router.post('/admin/upload', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

module.exports = router; 