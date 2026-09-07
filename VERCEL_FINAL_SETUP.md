# Vercel Deployment - FINAL SETUP GUIDE

## Problem Summary
Despite having correct vercel.json configuration, Vercel keeps reporting:
```
Error: No Output Directory named "dist" found after the Build completed
```

**Root Cause:** Vercel's project settings are overriding the vercel.json file.

## CRITICAL: Manual Configuration Required

You MUST configure these settings in Vercel's Web Dashboard for deployment to work:

### Step 1: Go to Your Vercel Project
1. Visit: https://vercel.com/dashboard
2. Click on your MPLADS project
3. Click **Settings** tab

### Step 2: Build & Development Settings
Navigate to **Build & Development** section and configure:

```
Framework Preset: Other
Build Command: npm run build
Output Directory: dist
Install Command: npm install --legacy-peer-deps
Development Command: (leave empty or npm run dev)
```

### Step 3: Root Directory
- **Root Directory:** Leave as default or set to root (NOT MPLADS-UI, just `/`)
- The build will run in the MPLADS-UI folder automatically

### Step 4: Environment Variables (if needed)
- If your app needs `.env` variables, add them here
- Example: `VITE_API_URL`, `VITE_APP_ENV`, etc.

### Step 5: Save Settings
- Click **Save** button
- Wait for settings to be applied

### Step 6: Trigger Redeploy
1. Go to **Deployments** tab
2. Find the latest failed deployment
3. Click the three dots **...** menu
4. Select **Redeploy**
5. Confirm redeploy

## Why This Works

- Vercel project settings take precedence over vercel.json in many cases
- Setting `Build Command: npm run build` tells Vercel to compile the app
- Setting `Output Directory: dist` tells Vercel where the compiled files are
- When Vercel runs npm run build, it executes Vite which creates dist/ folder
- Vercel then finds and deploys the dist/ folder

## vercel.json Configuration (Already in Repo)

The vercel.json is already configured correctly:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

The `rewrites` section ensures that all routes serve index.html for proper SPA routing.

## Testing After Deployment

Once deployed:
1. Visit the live URL
2. Check the homepage loads (should see MPLADS Sentinel)
3. Click navigation links to test SPA routing
4. Refresh page - should stay on same route (not 404)
5. Check browser console for any errors

## If Still Getting 404

If you still see 404 errors after following these steps:
1. Check that `rewrites` are in vercel.json (they are)
2. Verify Build Command ran successfully in Vercel logs
3. Check that dist/ has index.html inside it
4. Contact Vercel support with build logs

## Commit Information

Latest commit with this configuration: `07fa394`
Branch: `feature/mplad-frontend`
