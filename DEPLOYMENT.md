# 🚀 Deployment Guide

This guide will help you deploy the Manj Book blog to production with Netlify frontend and a separate backend service.

## 📋 Overview

- **Everything**: Deployed to Netlify (frontend + backend functions)
- **Database**: In-memory storage (posts persist during function lifecycle)
- **Images**: Cloudinary (free CDN hosting)

## 🚀 Step 1: Deploy Everything to Netlify

### Automatic Deployment (Super Easy!)

1. Go to [netlify.app](https://netlify.app) and login
2. Click "Add new site" → "Import an existing project"  
3. Connect your GitHub repository (`KrishSaraf/manj-book`)
4. Netlify will automatically detect the `netlify.toml` configuration
5. Click **"Deploy site"** - that's it! 🎉

### Manual Deployment

If you prefer manual deployment:

```bash
cd frontend
npm run build
# Then drag the `build` folder to Netlify's deployment area
```

## 🌐 Step 2: Configure Your Custom Domain

1. In Netlify dashboard, go to **Domain settings**
2. Click "Add custom domain"
3. Add your domain (e.g., `manjbook.com`)
4. Follow Netlify's DNS configuration instructions
5. Enable HTTPS (automatic with Netlify)

## 📸 Step 3: Setup Image Uploads (Optional)

Follow the simple guide: [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)
- 5 minutes to setup
- Free Cloudinary account
- Professional image hosting with CDN

## 🔐 Step 4: Admin Access

1. Visit your site: `https://yourdomain.com`
2. Go to `/admin/login`
3. Login with:
   - **Username**: `girlfriend`
   - **Password**: `nature2024`

## 🛠️ Step 6: Backend Environment Variables

Set these in your backend hosting service:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `5000` | Server port |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `FRONTEND_URL` | `https://yourdomain.com` | Your frontend URL for CORS |

## 📝 Step 7: Update Backend for Production

Your backend should automatically work, but if you need to update CORS settings, make sure your backend allows your domain:

```javascript
// In backend/server.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

## 🚨 Troubleshooting

### Frontend Issues
- **404 on refresh**: Check that `_redirects` file exists in `frontend/public/`
- **API calls failing**: Verify `REACT_APP_API_URL` environment variable

### Backend Issues
- **Database not working**: Backend will create SQLite database automatically
- **CORS errors**: Add your domain to CORS origins
- **File uploads failing**: Ensure upload directory exists and has write permissions

### SSL/HTTPS Issues
- Netlify provides automatic HTTPS
- Make sure your API calls use HTTPS in production

## 🎉 Success!

Once everything is deployed:

1. ✅ Your blog will be live at your custom domain
2. ✅ Manjari can create posts at `/admin`
3. ✅ Images and posts will work seamlessly
4. ✅ The site will be fast and SEO-friendly

## 🔄 Future Updates

To update your site:

1. **Frontend changes**: Netlify will auto-deploy when you push to GitHub
2. **Backend changes**: Your hosting service will auto-deploy as well

## 📞 Need Help?

If you run into issues:
1. Check Netlify build logs in the dashboard
2. Check backend logs in Railway/Render/Heroku dashboard
3. Verify all environment variables are set correctly

---

🌟 **Enjoy your beautiful nature blog!** 🌱 