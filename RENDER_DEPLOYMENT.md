# Deployment to Render

Your MPLADS frontend is ready to deploy to Render!

## Steps to Deploy:

### 1. Create a Render Account
- Go to [https://render.com](https://render.com)
- Sign up with GitHub (recommended for auto-deployment)

### 2. Create a New Web Service
- Click "New +" → "Web Service"
- Connect your GitHub account and select the `codeWithkrish123/MPLADS` repository
- Branch: `feature/mplad-frontend`

### 3. Configure the Service
- **Name**: `mplads-frontend` (or your preferred name)
- **Environment**: `Docker`
- **Dockerfile Path**: `./Dockerfile` (auto-detected)
- **Port**: `3000` (auto-detected from Dockerfile)
- **Plan**: Free (or paid if you need better performance)
- **Region**: Oregon (or closest to you)

### 4. Environment Variables (Optional)
- No environment variables are required for basic deployment
- If you need API endpoints, add them as environment variables

### 5. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy your app
- First deployment takes 5-10 minutes
- Subsequent deployments are faster

### 6. Access Your App
- Once deployed, you'll get a URL like: `https://mplads-frontend-xxxxx.onrender.com`
- Every push to `feature/mplad-frontend` branch will auto-redeploy

## Troubleshooting

### Build Fails
- Check the deployment logs on Render dashboard
- Ensure all dependencies in `package.json` are correct
- Run `npm install --legacy-peer-deps` locally to verify

### App Crashes After Build
- Check "Logs" tab in Render dashboard
- The app uses `serve` package to serve static files on port 3000
- Make sure port 3000 is being used

### Cold Starts
- Free tier apps sleep after 15 minutes of inactivity
- First request after sleep may take 30 seconds
- Upgrade to paid plan to avoid cold starts

## Auto-Deployment Setup

Your repository is already configured for automatic deployment:
- Every commit to `feature/mplad-frontend` triggers a rebuild
- To disable auto-deploy, go to Render dashboard → Settings → disable auto-deploy

## Production Deployment (Main Branch)

When ready to go live, merge `feature/mplad-frontend` to `main`:

```bash
git checkout main
git merge feature/mplad-frontend
git push origin main
```

Then create a separate production service on Render pointing to the `main` branch.

## Monitoring

Monitor your app on Render dashboard:
- **Logs**: View real-time application logs
- **Metrics**: CPU, memory, and network usage
- **Health Checks**: Automatic uptime monitoring

---

**Happy Deploying!** 🚀
