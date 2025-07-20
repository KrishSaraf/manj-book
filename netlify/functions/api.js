const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const serverless = require('serverless-http');

// Create Express app
const app = express();

// Configure multer for handling file uploads in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware - Configure CORS for custom domain
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://museminutesbymanjari.com',
    /\.netlify\.app$/
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Simplified Cloudinary upload function for Netlify compatibility
const uploadToCloudinary = async (fileBuffer, fileName) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo';
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    
    // For now, return a beautiful placeholder with the filename
    // This ensures the site works while Cloudinary is being set up
    const encodedName = encodeURIComponent(fileName.replace(/\.[^/.]+$/, ''));
    return `https://via.placeholder.com/800x400/4ade80/ffffff?text=${encodedName}`;
    
  } catch (error) {
    console.error('Image upload error:', error);
    // Always return a working placeholder
    return `https://via.placeholder.com/800x400/4ade80/ffffff?text=Image`;
  }
};

// Simple in-memory storage (for demo - in production you'd use a real database)
let posts = [
  {
    id: 1,
    title: "Welcome to Manjari's Nature Blog",
    content: "# Welcome!\n\nThis is where I'll share my thoughts on books, nature, and life. Looking forward to this journey!",
    excerpt: "Welcome to my digital garden where books and nature intertwine.",
    featured_image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
    category: "general",
    tags: ["welcome", "introduction"],
    is_published: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: 1,
    author_name: "Manjari"
  }
];

let users = [
  {
    id: 1,
    username: "girlfriend",
    password: "nature2024", // Temporarily using plain text for testing
    role: "admin",
    name: "Manjari"
  }
];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production";

// Helper functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};

// Create a router to handle all routes
const router = express.Router();

// Root path
router.get('/', (req, res) => {
  console.log('API Root accessed');
  res.json({ 
    message: 'Nature Blog API', 
    endpoints: ['/health', '/auth/login', '/blog/posts'],
    timestamp: new Date().toISOString(),
    status: 'WORKING'
  });
});

// Health check - This will now be at /.netlify/functions/api/health
router.get('/health', (req, res) => {
  console.log('Health check accessed');
  res.json({ 
    status: 'ok', 
    message: 'Nature Blog API is running!',
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working', 
    path: req.path, 
    url: req.url,
    originalUrl: req.originalUrl 
  });
});

// Auth routes
router.post('/auth/login', async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Body:', req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('=== PASSWORD VERIFICATION ===');
    console.log('Provided password:', password);
    console.log('Stored password:', user.password);
    console.log('Attempting password comparison...');
    
    // Temporarily use plain text comparison for testing
    let isValidPassword;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // It's a bcrypt hash
      console.log('Using bcrypt comparison');
      isValidPassword = await bcrypt.compare(password, user.password);
    } else {
      // It's plain text (for testing only)
      console.log('Using plain text comparison');
      isValidPassword = password === user.password;
    }
    
    console.log('Password comparison result:', isValidPassword);
    console.log('Type of result:', typeof isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const userResponse = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    };

    console.log('=== LOGIN SUCCESS ===', username);
    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/auth/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

router.get('/auth/profile', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  });
});

// Blog routes - Public
router.get('/blog/posts', (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let filteredPosts = posts.filter(post => post.is_published === 1);

    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by creation date (newest first)
    filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredPosts.length / limitNum);

    res.json({
      posts: paginatedPosts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts: filteredPosts.length,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/blog/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const post = posts.find(p => p.id === parseInt(id) && p.is_published === 1);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/blog/categories', (req, res) => {
  try {
    const categories = [...new Set(posts.filter(p => p.is_published === 1).map(p => p.category))];
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blog routes - Admin
router.get('/blog/admin/posts', verifyToken, requireAdmin, (req, res) => {
  try {
    const sortedPosts = posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(sortedPosts);
  } catch (error) {
    console.error('Get admin posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/blog/admin/posts', verifyToken, requireAdmin, upload.single('featured_image'), async (req, res) => {
  try {
    const { title, content, excerpt, category = 'general', tags, is_published = true } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const tagsArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []);
    const publishedValue = is_published === 'true' || is_published === true || is_published === '1' || is_published === 1 ? 1 : 0;

    let featured_image = null;
    
    // Handle image upload if provided
    if (req.file) {
      try {
        featured_image = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      } catch (error) {
        console.error('Image upload error:', error);
        // Continue without image if upload fails
      }
    }

    const newPost = {
      id: Math.max(...posts.map(p => p.id), 0) + 1,
      title,
      content,
      excerpt: excerpt || '',
      featured_image,
      category,
      tags: tagsArray,
      is_published: publishedValue,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_id: req.user.id,
      author_name: req.user.name || req.user.username
    };

    posts.push(newPost);

    res.status(201).json({
      message: 'Blog post created successfully',
      post: newPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/blog/admin/posts/:id', verifyToken, requireAdmin, upload.single('featured_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category, tags, is_published } = req.body;

    const postIndex = posts.findIndex(p => p.id === parseInt(id));
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const tagsArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []);
    const publishedValue = is_published === 'true' || is_published === true || is_published === '1' || is_published === 1 ? 1 : 0;

    let featured_image = posts[postIndex].featured_image; // Keep existing image
    
    // Handle new image upload if provided
    if (req.file) {
      try {
        featured_image = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      } catch (error) {
        console.error('Image upload error:', error);
        // Keep existing image if upload fails
      }
    }

    posts[postIndex] = {
      ...posts[postIndex],
      title: title || posts[postIndex].title,
      content: content || posts[postIndex].content,
      excerpt: excerpt !== undefined ? excerpt : posts[postIndex].excerpt,
      featured_image,
      category: category || posts[postIndex].category,
      tags: tagsArray,
      is_published: publishedValue,
      updated_at: new Date().toISOString()
    };

    res.json({
      message: 'Blog post updated successfully',
      post: posts[postIndex]
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/blog/admin/posts/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const postIndex = posts.findIndex(p => p.id === parseInt(id));

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    posts.splice(postIndex, 1);

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Use the router under the correct base path for Netlify
app.use('/.netlify/functions/api', router);

// Catch-all handler for debugging
app.use('*', (req, res) => {
  console.log('UNMATCHED ROUTE:', req.method, req.originalUrl, req.path);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    availableRoutes: ['/', '/health', '/auth/login', '/blog/posts']
  });
});

// Export serverless function
module.exports.handler = serverless(app); 