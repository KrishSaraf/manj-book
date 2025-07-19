# 🚀 Deployment Guide

This guide will help you deploy the Manj Book blog to production with Netlify frontend and a separate backend service.

## 📋 Overview

- **Frontend**: Deployed to Netlify with your custom domain
- **Backend**: Deployed to Railway, Render, or Heroku
- **Database**: SQLite (will automatically create on backend deployment)

## 🎯 Step 1: Deploy Backend (Choose One)

### Option A: Railway (Recommended - Free tier available)

1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click "Deploy from GitHub repo"
3. Select your `manj-book` repository
4. Choose "Deploy from subdirectory" → `backend`
5. Railway will automatically detect Node.js and deploy
6. Once deployed, copy your Railway app URL (looks like: `https://your-app.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Once deployed, copy your Render app URL

### Option C: Heroku

1. Install Heroku CLI and login
2. In your project root:
```bash
cd backend
git init
git add .
git commit -m "Backend for Heroku"
heroku create your-app-name
git push heroku main
```

## 🌐 Step 2: Deploy Frontend to Netlify

### Automatic Deployment (Recommended)

1. Go to [netlify.app](https://netlify.app) and login
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Netlify will automatically detect the `netlify.toml` configuration
5. Before deploying, add environment variables:
   - Go to **Site settings** → **Environment variables**
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com/api`
   - (Replace with your actual backend URL from Step 1)

### Manual Deployment

If you prefer manual deployment:

```bash
cd frontend
npm run build
# Then drag the `build` folder to Netlify's deployment area
```

## ⚙️ Step 3: Configure Your Custom Domain

1. In Netlify dashboard, go to **Domain settings**
2. Click "Add custom domain"
3. Add your domain (e.g., `manjbook.com`)
4. Follow Netlify's DNS configuration instructions
5. Enable HTTPS (automatic with Netlify)

## 🔧 Step 4: Environment Variables

Make sure these are set in Netlify:

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend-url.com/api` | Your backend API URL |

## 🔐 Step 5: Admin Access

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