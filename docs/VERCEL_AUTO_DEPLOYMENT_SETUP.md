# 🚀 VERCEL AUTO-DEPLOYMENT SETUP GUIDE

**Goal:** Deploy MPLADS-UI to Vercel with automatic deployments on every commit  
**Time:** 15 minutes  
**Result:** Production URL with CI/CD pipeline

---

## 📋 STEP-BY-STEP SETUP

### STEP 1: Go to Vercel Website

1. Visit: https://vercel.com
2. Click: "Sign up" (or log in)
3. Choose: "Sign up with GitHub"
4. Authorize Vercel to access your GitHub

---

### STEP 2: Import Project

1. On Vercel dashboard, click: "Add New"
2. Click: "Project"
3. Click: "Import Git Repository"
4. Select: **codeWithkrish123/MPLADS**
5. Click: "Import"

---

### STEP 3: Configure Project

**Framework:** React  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm ci`  

---

### STEP 4: Set Environment Variables

Click: "Environment Variables"

Add these variables:

```
Name: VITE_API_BASE_URL
Value: https://your-backend-api.com
```

```
Name: NODE_ENV
Value: production
```

```
Name: VITE_ENABLE_MOCK_DATA
Value: false
```

(Add any other API keys your backend needs)

---

### STEP 5: Deploy

Click: "Deploy"

**Wait 2-3 minutes...**

When complete, you'll get:
- ✅ Production URL (e.g., `https://mplads-ui.vercel.app`)
- ✅ GitHub integration active
- ✅ Auto-deployments enabled

---

## ⚙️ AUTO-DEPLOYMENT CONFIGURATION

### What Vercel Does Automatically:

**On Every Commit:**
1. ✅ Triggers build automatically
2. ✅ Installs dependencies: `npm ci`
3. ✅ Runs build: `npm run build`
4. ✅ Deploys to production

**Before Merging:**
1. ✅ Creates preview URL for pull requests
2. ✅ Team can review before production

---

## 🔄 DEPLOYMENT WORKFLOW

### Step 1: Make Changes Locally
```bash
# On your computer
git checkout feature/mplad-frontend
# Make changes to code
```

### Step 2: Commit & Push
```bash
git add .
git commit -m "feat: add feature X"
git push origin feature/mplad-frontend
```

### Step 3: Vercel Deploys Automatically ⚡
- GitHub webhook triggers Vercel
- Build starts automatically
- Deploy completes in 2-3 minutes
- New version goes LIVE

### Step 4: Production URL Updates
- Your site updates automatically
- Preview URL created for PRs
- Old versions still accessible via deployments tab

---

## ✅ VERIFY DEPLOYMENT

### Check Production:
1. Visit: https://mplads-ui.vercel.app (your URL)
2. Should see live website
3. Any new commits automatically redeploy

### Check Build Status:
1. Go to: https://vercel.com/dashboard
2. Click your project
3. See deployment history
4. View logs if any issues

---

## 📱 PRODUCTION-READY CHECKLIST

- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Build succeeds without errors
- [ ] Production URL accessible
- [ ] Mock data removed from frontend
- [ ] API endpoints configured
- [ ] Backend connection working
- [ ] Auto-deployment enabled
- [ ] Team members can access production

---

## 🎯 AUTO-DEPLOYMENT BEHAVIOR

### ✅ Automatic Deployments Trigger For:
- Commits to `main` branch → Production
- Commits to `feature/mplad-frontend` → Staging
- Pull requests → Preview URLs

### ✅ What Happens:
```
Your Commit
    ↓
GitHub Webhook
    ↓
Vercel Build Starts
    ↓
npm install → npm run build
    ↓
Tests (if configured)
    ↓
Deploy to Production
    ↓
URL Updates Live
    ↓
Notification sent
```

### ✅ If Build Fails:
- Deployment stops
- Previous version stays live
- You get error notification
- Check logs to fix

---

## 📊 PRODUCTION ENVIRONMENT VARIABLES

These should be set in Vercel (not in .env file):

```
VITE_API_BASE_URL=https://backend-api.mplads.gov.in
VITE_API_KEY=your_production_api_key
NODE_ENV=production
VITE_ENABLE_MOCK_DATA=false
```

**NEVER commit .env files!** They're automatically excluded by .gitignore

---

## 🔗 IMPORTANT LINKS

**Production URL:**
- Will be: `https://mplads-ui.vercel.app` (or custom domain)

**Vercel Dashboard:**
- https://vercel.com/dashboard

**GitHub Integration:**
- Automatic when you import project

**Deployment History:**
- Available in Vercel dashboard
- Click project → Deployments tab

---

## 🚨 IF DEPLOYMENT FAILS

### Common Issues:

**Issue: Build fails with error**
```
Solution:
1. Check error message in Vercel logs
2. Fix locally: npm run build
3. Commit fix
4. Vercel auto-retries
```

**Issue: Environment variables not working**
```
Solution:
1. Go to Vercel dashboard
2. Project settings → Environment Variables
3. Verify all variables are set
4. Redeploy manually
```

**Issue: Old version still showing**
```
Solution:
1. Wait 5 minutes (cache clearing)
2. Hard refresh: Ctrl+Shift+R
3. Clear browser cache
4. Check Vercel deployment status
```

---

## 🎉 FINAL SETUP SUMMARY

### You Now Have:

✅ **Production Website**
- URL: https://mplads-ui.vercel.app
- HTTPS: Automatic
- Global CDN: Included

✅ **Automatic CI/CD**
- Every commit auto-deploys
- Build failures stop deployment
- GitHub integration active

✅ **Preview Deployments**
- Pull request previews
- Team can review before merge
- Shareable preview URLs

✅ **Monitoring**
- Build logs available
- Deployment history visible
- Analytics included

---

## 📋 NEXT STEPS

1. ✅ Setup Vercel (follow steps above)
2. ✅ Remove mock data from frontend
3. ✅ Connect backend API
4. ✅ Test production deployment
5. ✅ Enable domain (optional)

---

**Status:** Ready to deploy  
**Time to setup:** 15 minutes  
**Result:** Production MPLADS-UI live with auto-deployment! 🚀

