# 🖼️ Cloudinary Image Upload Setup

## Quick Setup (5 minutes)

### Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After signup, you'll see your **Dashboard** with credentials

### Step 2: Get Your Credentials
From your Cloudinary Dashboard, copy:
- **Cloud Name** (e.g., `your-cloud-name`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### Step 3: Create Upload Preset
1. In Cloudinary dashboard, go to **Settings** → **Upload**
2. Click **Add upload preset**
3. Set:
   - **Preset name**: `nature-blog-uploads`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `nature-blog`
4. Click **Save**

### Step 4: Configure Netlify Environment Variables
1. Go to your Netlify site dashboard
2. Go to **Site Settings** → **Environment Variables**
3. Add these variables:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_UPLOAD_PRESET=nature-blog-uploads
```

### Step 5: Redeploy
1. In Netlify, go to **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

## Testing Image Upload

1. Go to your admin panel: `https://your-site.com/admin`
2. Create a new post
3. Upload an image
4. The image should now appear properly!

## Troubleshooting

If images still don't work:
1. Check Netlify function logs for Cloudinary errors
2. Verify environment variables are set correctly
3. Make sure upload preset is "Unsigned"
4. Check Cloudinary dashboard for uploaded images

## Without Cloudinary

If you don't want to set up Cloudinary, the site will use beautiful stock images as placeholders. 