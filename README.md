# 🌿 Nature Blog - A Digital Garden for Book Lovers

A beautiful, nature-inspired blog website built with React and Node.js, perfect for sharing book reviews, thoughts, and nature-inspired content. Features a serene green design with an intuitive admin interface for easy content management.

## ✨ Features

### 🌱 Beautiful Design
- **Nature-inspired theme** with green color palette
- **Responsive design** that works on all devices
- **Custom animations** and floating elements
- **Google Fonts integration** (Inter, Playfair Display, Crimson Text)

### 📚 Content Management
- **Easy-to-use admin interface** with prominent "+" button for adding posts
- **Markdown editor** with helpful toolbar for rich content
- **Image upload** with drag-and-drop support
- **Categories and tags** for organizing content
- **Draft and published states** for content workflow

### 🔍 User Experience
- **Search functionality** to find specific posts
- **Category filtering** to browse by topic
- **Pagination** for large content collections
- **Individual post pages** with beautiful typography
- **Mobile-friendly navigation**

### 🔐 Security & Authentication
- **JWT-based authentication** for admin access
- **Protected admin routes** with automatic redirects
- **Password hashing** with bcrypt
- **Rate limiting** to prevent abuse
- **CORS protection** for API security

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the code, navigate to the directory
   cd nature-blog
   ```

2. **Install dependencies for all components**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   Create a `.env` file in the `backend` directory:
   ```bash
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   DB_NAME=nature_blog.db
   ADMIN_USERNAME=girlfriend
   ADMIN_PASSWORD=change-this-password
   ```

4. **Start the application**
   ```bash
   # Start both backend and frontend in development mode
   npm run dev
   ```

   Or run them separately:
   ```bash
   # Terminal 1: Start the backend
   npm run server

   # Terminal 2: Start the frontend
   npm run client
   ```

5. **Access the application**
   - **Public blog**: http://localhost:3000
   - **Admin login**: http://localhost:3000/admin/login
   - **API**: http://localhost:5000/api

### Default Admin Credentials
- **Username**: `girlfriend` (or whatever you set in ADMIN_USERNAME)
- **Password**: `change-this-password` (change this in your .env file!)

## 📖 How to Use

### For Your Girlfriend (Admin User)

1. **Login to Admin**
   - Go to `/admin/login`
   - Use the credentials you set up
   - You'll be redirected to the admin dashboard

2. **Create a New Post**
   - Click the big **"+ New Post"** button (prominent and easy to find!)
   - Fill in the post title
   - Write content using Markdown (toolbar helpers available)
   - Add an optional featured image
   - Set category (books, nature, thoughts, etc.)
   - Add tags separated by commas
   - Choose to publish immediately or save as draft

3. **Manage Existing Posts**
   - View all posts in the admin posts section
   - Edit posts by clicking the edit icon
   - Delete posts with the trash icon
   - Toggle between published and draft states

4. **Content Writing Tips**
   - Use Markdown for rich formatting
   - **Bold text**: `**text**`
   - *Italic text*: `*text*`
   - Headings: `## Heading`
   - Links: `[link text](URL)`
   - Lists: Use `-` for bullet points

### For Visitors (Public)

1. **Browse the Blog**
   - Homepage shows recent posts and beautiful hero section
   - Blog page shows all posts with search and filtering
   - Individual post pages for reading full content

2. **Search and Filter**
   - Use the search bar to find specific content
   - Filter by categories (books, nature, thoughts, etc.)
   - Browse by tags and publication dates

## 🗂️ Project Structure

```
nature-blog/
├── backend/                 # Express.js API server
│   ├── config.js           # Configuration settings
│   ├── server.js           # Main server file
│   ├── database/           # SQLite database setup
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API routes (auth, blog)
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (auth)
│   │   ├── pages/          # Page components
│   │   ├── utils/          # API utilities
│   │   └── App.js          # Main app component
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── package.json        # Frontend dependencies
├── package.json            # Root package with scripts
└── README.md              # This file
```

## 🛠️ Development

### Available Scripts

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend in development
npm run dev

# Start only the backend server
npm run server

# Start only the frontend
npm run client

# Build for production
npm run build

# Start production server
npm start
```

### Environment Configuration

#### Backend (.env file)
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens (change this!)
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password (change this!)
- `NODE_ENV`: Environment (development/production)

#### Frontend
- Automatically proxies API requests to backend in development
- Builds static files for production deployment

## 🎨 Customization

### Changing Colors
Edit `frontend/tailwind.config.js` to modify the nature-inspired color palette:
- `primary`: Main green colors
- `forest`: Darker green tones
- `sage`: Muted green/gray tones
- `earth`: Brown accent colors

### Adding Categories
Modify the category options in:
- `frontend/src/pages/admin/CreatePost.js`
- `frontend/src/pages/admin/EditPost.js`

### Styling
- CSS classes are defined in `frontend/src/index.css`
- Uses Tailwind CSS utility classes
- Custom components like `.btn-primary`, `.card`, `.nature-pattern`

## 🚀 Deployment

### Production Build
```bash
# Build the frontend
npm run build

# Start production server
npm start
```

### Environment Variables for Production
Make sure to set secure values for:
- `JWT_SECRET`: Use a long, random string
- `ADMIN_PASSWORD`: Use a strong password
- `NODE_ENV=production`

### Hosting Recommendations
- **Frontend**: Netlify, Vercel, or any static hosting
- **Backend**: Railway, Heroku, DigitalOcean, or any Node.js hosting
- **Database**: SQLite file will be created automatically

## 🤝 Features for Your Girlfriend

This blog is designed specifically for easy use:

1. **🎯 One-Click Publishing**: Big, obvious "+" buttons everywhere
2. **📝 Simple Editor**: Markdown with helpful toolbar
3. **🖼️ Easy Images**: Drag-and-drop image uploads
4. **📱 Mobile Friendly**: Works perfectly on phone/tablet
5. **🌿 Beautiful Design**: Nature-inspired, calming interface
6. **📚 Book-Focused**: Categories perfect for book reviews
7. **🔍 Search & Filter**: Easy to find old posts
8. **💾 Auto-Save**: Draft system prevents lost work

## 📚 Technologies Used

### Backend
- **Node.js** & **Express.js** - Server framework
- **SQLite** - Simple, file-based database
- **JWT** - Secure authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **React Query** - Data fetching
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Lucide React** - Beautiful icons
- **React Markdown** - Markdown rendering

## 💡 Tips for Success

1. **Regular Backups**: The SQLite database is in `backend/nature_blog.db`
2. **Image Organization**: Uploaded images are stored in `backend/uploads/`
3. **Content Ideas**: Perfect for book reviews, reading lists, nature thoughts
4. **SEO Friendly**: All pages have proper titles and meta descriptions

## 🆘 Troubleshooting

### Common Issues

**"Cannot find module" errors**
```bash
npm run install-all
```

**Database not found**
- The SQLite database is created automatically on first run
- Check `backend/nature_blog.db` exists

**CORS errors**
- Make sure the frontend proxy is set to backend port
- Check `frontend/package.json` has `"proxy": "http://localhost:5000"`

**Login not working**
- Check your `.env` file has the correct credentials
- Default username: `girlfriend`, password: `change-this-password`

**Images not loading**
- Uploaded images are served from `/uploads/` on the backend
- Make sure the backend server is running

## 🎉 Getting Started Gift Message

*"Hey! I built this beautiful blog website for you where you can share all your book reviews and thoughts. It has a nature-inspired design that I thought you'd love. Just click the big '+' button to add new posts - it's super easy! The login details are [provide the credentials you set]. Have fun sharing your literary adventures! 🌱📚"*

---

**Built with 💚 for sharing stories and growing ideas** 