# Vercel Deployment - Permanent Fix Required

## Problem
Vercel keeps reporting: `Error: No Output Directory named "dist" found after the Build completed.`

This happens because Vercel is running npm install from the repository root instead of from the MPLADS-UI directory.

## Root Cause
The Git repository root is MPLADS-UI, but Vercel clones the entire MPLADS repository. Vercel's auto-detection isn't recognizing that MPLADS-UI should be treated as the project root.

## Permanent Solution
You must configure this in **Vercel Project Settings** (not in code):

### Steps:
1. Go to your Vercel Dashboard
2. Select the MPLADS project
3. Click **Settings** tab
4. Go to **Build & Development Settings**
5. Configure the following:

   **Root Directory:** `MPLADS-UI`
   
   **Build Command:** `npm run build`
   
   **Output Directory:** `dist`
   
   **Install Command:** `npm install --legacy-peer-deps`

6. Click **Save**
7. Trigger a new deployment

### Why This Works
- Setting the **Root Directory** to `MPLADS-UI` tells Vercel to treat that folder as the project root
- This ensures npm install and build run in the correct directory
- The dist folder will be found at `MPLADS-UI/dist`

## vercel.json Configuration
The vercel.json in MPLADS-UI is now properly configured:
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

**Note:** The vercel.json alone is NOT enough. Dashboard configuration is REQUIRED because Vercel clones the entire repository.

## After Configuration
- Trigger a redeploy
- Deployment should succeed with proper routing for React Router
