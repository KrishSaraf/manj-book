# 📸 Image Upload Setup with Cloudinary

Your blog now supports image uploads using **Cloudinary** (free service)! Here's how to set it up:

## 🚀 Quick Setup (5 minutes):

### **Step 1: Create Free Cloudinary Account**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. You'll get your dashboard with your credentials

### **Step 2: Get Your Credentials**
In your Cloudinary dashboard, you'll see:
- **Cloud Name**: Something like `dw1abc123`
- **Upload Preset**: You need to create one

### **Step 3: Create Upload Preset**
1. In Cloudinary dashboard, go to **Settings** → **Upload**
2. Click **"Add upload preset"**
3. Set:
   - **Preset name**: `manj-book-uploads` (or anything you like)
   - **Signing Mode**: **Unsigned**
   - **Folder**: `manj-book` (optional, for organization)
4. Click **"Save"**

### **Step 4: Add to Netlify**
1. In your Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add these variables:
   - **Key**: `CLOUDINARY_CLOUD_NAME` **Value**: Your cloud name (e.g., `dw1abc123`)
   - **Key**: `CLOUDINARY_UPLOAD_PRESET` **Value**: Your preset name (e.g., `manj-book-uploads`)

### **Step 5: Deploy & Test!**
1. Redeploy your site in Netlify (or it will auto-deploy)
2. Go to `/admin` and create a new post
3. Upload an image - it will be stored on Cloudinary! 📸

## 🌟 **Benefits:**
- ✅ **Free tier**: 25GB storage, 25GB bandwidth/month
- ✅ **Fast CDN**: Images load super fast worldwide
- ✅ **Auto optimization**: Images are compressed and optimized
- ✅ **Reliable**: 99.9% uptime guarantee

## 🔧 **Fallback:**
If Cloudinary fails (wrong credentials, etc.), images will show a nice placeholder instead of breaking the site.

## 💡 **Pro Tips:**
- Images are automatically optimized by Cloudinary
- You can see all uploaded images in your Cloudinary dashboard
- Free tier is generous - perfect for personal blogs
- You can upgrade later if needed

## 🚨 **Troubleshooting:**
- **Images not uploading?** Check your environment variables in Netlify
- **Wrong credentials?** Double-check cloud name and upload preset
- **Still issues?** Images will show placeholders, site still works perfectly

---

🎉 **That's it! Your blog now has professional image hosting!** 📸✨ 