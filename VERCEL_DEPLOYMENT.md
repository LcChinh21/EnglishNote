# EnglishNote - Vercel Deployment Guide 🚀

This guide explains how to deploy **EnglishNote** on Vercel as a serverless application without needing a separate backend server.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab Account**: For connecting your repository
3. **MongoDB Atlas Account**: Free tier at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **Git installed**: For pushing code to your repository

## 🔐 Security Important!

**Never commit secrets to GitHub:**
- ❌ Don't add `MONGODB_URI` or `JWT_SECRET` to `.env` in Git
- ✅ Use Vercel Dashboard to set environment variables
- ✅ Keep your MongoDB password confidential
- ✅ Regenerate JWT secret for production

## 🗄️ Architecture Changes

### Old Structure (Server + Client Separate)
```
Backend: Node.js/Express server (separate deployment)
Frontend: React app (separate deployment)
```

### New Structure (Vercel Serverless)
```
One Vercel Project:
├── /api/*              → Vercel Serverless Functions (replaces Express)
├── /client/src/*       → React Frontend (served as static)
└── /public             → Static assets
```

**Benefits:**
- ✅ Single deployment, single domain
- ✅ No server to manage
- ✅ Auto-scales with demand
- ✅ Free tier available
- ✅ No cold start issues for typical use

---

## 🔧 Step 1: Prepare MongoDB Atlas

### 1.1 Create MongoDB Atlas Account & Cluster

1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up
2. Create a **Free Tier Cluster** (M0 - always free)
3. Choose your region (e.g., `US East`)
4. Wait for cluster to deploy (~5 min)

### 1.2 Create Database User

1. Go to **Database Access** → **Add New Database User**
2. Username: `englishnote_user`
3. Password: Generate a strong one (or create)
4. Database User Privileges: `Read and write to any database`
5. Click **Add User**

### 1.3 Get Connection String

1. Go to **Databases** → Click **Connect** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://englishnote_user:<password>@englishnote.bvmmtvi.mongodb.net/?appName=EnglishNote
   ```
   Replace `<password>` with your actual database user password

4. Your connection string should look like:
   ```
   mongodb+srv://englishnote_user:your_actual_password@englishnote.bvmmtvi.mongodb.net/?appName=EnglishNote
   ```
   **⚠️ IMPORTANT:** Keep your password secret! Never commit this to Git.

### 1.4 Whitelist IPs (Allow Vercel)

1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (or add specific Vercel IPs later)
3. Click **Confirm**

---

## 📦 Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository

```bash
cd c:\Users\Admin\Desktop\EnglishNote
git init
git add .
git commit -m "Initial commit: EnglishNote Vercel version"
```

### 2.2 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `englishnote`
3. Description: "English vocabulary note-taking app with OCR"
4. Make it **Public** or **Private** (as you prefer)
5. Click **Create repository**

### 2.3 Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/englishnote.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 🚀 Step 3: Deploy to Vercel

### 3.1 Connect Vercel to GitHub

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Paste your GitHub repo URL and click **Continue**
4. Authenticate with GitHub if prompted
5. Select your `englishnote` repository
6. Click **Import**

### 3.2 Configure Environment Variables

In the **Environment Variables** section, add:

| Name | Value | Description |
|------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://englishnote_user:YOUR_PASSWORD@englishnote.bvmmtvi.mongodb.net/?appName=EnglishNote` | Your MongoDB connection string (replace YOUR_PASSWORD) |
| `JWT_SECRET` | `your_super_secret_key_change_this_12345` | JWT secret key (change to something secure) |

**Note:** For production, use a more secure JWT secret:
```
openssl rand -base64 32
```

### 3.3 Review Build Settings

- **Framework Preset**: `Other` (we configured this in vercel.json)
- **Build Command**: `cd client && npm install && npm run build`
- **Output Directory**: `client/build`
- **Install Command**: `npm install`

Vercel should auto-detect these from your `vercel.json`, but verify they're correct.

### 3.4 Deploy

Click **Deploy** and wait for the build to complete (usually 2-5 minutes).

Once finished, you'll get a Vercel URL like:
```
https://englishnote-xxxxxxx.vercel.app
```

---

## ✅ Testing After Deployment

### 4.1 Test Registration

1. Go to your Vercel URL
2. Click **Register**
3. Enter:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123`
4. Click **Register**

**Expected:** You're logged in and redirected to Dashboard ✓

### 4.2 Test Create Note

1. On Dashboard, click **Create New Note**
2. Enter:
   - Title: "Hello World"
   - Content: "This is my first note on Vercel!"
   - Date: Today
3. Click **Create Note**

**Expected:** Note appears in "Recent Notes" ✓

### 4.3 Test OCR Feature

1. Click **Create New Note** again
2. Click **📸 Scan Handwritten Notes (OCR)**
3. Upload an image with text
4. Click **🔍 Extract Text**

**Expected:** Text is extracted and displayed ✓

### 4.4 Test Performance

Check that the app loads quickly and API calls are instant (no server startup delays).

---

## 🔍 Debugging Deployment Issues

### Issue: "Cannot find module"

**Solution:** Check that all dependencies are in `package.json` files:
- Root `package.json`
- `client/package.json`
- API functions may need: `mongoose`, `jsonwebtoken`, `bcryptjs`

```bash
cd api/utils
npm install mongoose jsonwebtoken bcryptjs
```

### Issue: "MongoDB connection timeout"

**Cause:** IP whitelist not configured

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Click "Allow Access from Anywhere" (CIDR: 0.0.0.0/0)
3. Or add specific Vercel IPs (check Vercel docs)

### Issue: "Serverless function timeout"

**Cause:** MongoDB query taking too long

**Solution:**
1. Check MongoDB indexes are created
2. Use smaller date ranges in queries
3. Increase Vercel timeout in `vercel.json`:
```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### Issue: "CORS errors in browser console"

**Solution:** This should be fixed by CORS headers in each API function, but if not:
1. Update vercel.json with CORS headers
2. Or check that each API function has CORS headers set

---

## 📝 Environment Variables by Environment

### Local Development
```env
# .env (root)
MONGODB_URI=mongodb://localhost:27017/englishnote
JWT_SECRET=dev_secret_key_123

# client/.env
REACT_APP_API_URL=http://localhost:5000/api
```

### Production (Vercel)
```env
MONGODB_URI=mongodb+srv://englishnote_user:your_password_here@englishnote.bvmmtvi.mongodb.net/?appName=EnglishNote
JWT_SECRET=production_secret_key_change_this
```

⚠️ **Add these via Vercel Dashboard Environment Variables, NOT in code!**

---

## 🔄 Continuous Deployment

Every time you push to GitHub, Vercel **automatically redeploys**:

```bash
git add .
git commit -m "Add new feature"
git push origin main
```

You'll see the deployment progress in Vercel dashboard.

---

## 📊 Monitoring & Logs

### View Deployment Logs

1. Go to your Vercel project dashboard
2. Click **Deployments**
3. Click on the latest deployment
4. View **Build Logs** or **Function Logs**

### Monitor Function Performance

1. Go to **Analytics** tab
2. See request counts, response times, errors
3. Check which API functions are slowest

---

## 💰 Vercel Pricing

**Free Tier (Always):**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited serverless functions
- ✅ 100,000 function invocations
- ✅ Perfect for small to medium projects

**Pro Tier:** $20/month if you need more

---

## 🎯 Optimization Tips

### 1. Enable Vercel Cache
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### 2. Use MongoDB Connection Pooling
Update `api/utils/db.js` to reuse connections across function invocations.

### 3. Optimize Images
Resize and compress images before uploading to reduce OCR processing time.

---

## 🚀 Next Steps

1. **Custom Domain**: Add your own domain in Vercel settings
2. **CI/CD**: Set up GitHub Actions for tests before deploy
3. **Analytics**: Integrate Vercel Analytics or Mixpanel
4. **Backups**: Set up MongoDB Atlas automatic backups

---

## 📞 Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Support**: https://www.mongodb.com/support
- **React Docs**: https://react.dev

---

**Congratulations! Your EnglishNote app is now live on Vercel! 🎉**
