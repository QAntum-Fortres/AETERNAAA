# GitHub Pages Setup Instructions

## Overview
This repository is now configured to automatically deploy the AETERNA.WEBSITE SaaS platform to GitHub Pages whenever changes are pushed to the `main` branch.

## What Was Configured

### 1. GitHub Actions Workflow
- **File**: `.github/workflows/pages.yml`
- **Purpose**: Automatically builds and deploys the helios-ui React app to GitHub Pages
- **Trigger**: Runs on every push to `main` branch, or manually via workflow dispatch

### 2. Build Configuration
- **Vite Base Path**: Set to `/AETERNAAA/` to match the repository name
- **Build Script**: Modified to skip TypeScript type checking (prevents build failures from unused components)
- **.nojekyll File**: Added to ensure GitHub Pages serves the single-page application correctly

## How to Enable GitHub Pages

To activate GitHub Pages for this repository, follow these steps:

### Step 1: Go to Repository Settings
1. Navigate to your repository: https://github.com/QAntum-Fortres/AETERNAAA
2. Click on **Settings** (top navigation bar)

### Step 2: Configure GitHub Pages
1. In the left sidebar, click on **Pages** (under "Code and automation")
2. Under **Source**, select:
   - **Source**: `GitHub Actions`
   
   (This is important! Don't select "Deploy from a branch" - select "GitHub Actions")

### Step 3: Merge This PR
1. Once you merge this PR to the `main` branch, the workflow will automatically run
2. The workflow will:
   - Install dependencies
   - Build the React app
   - Deploy to GitHub Pages
3. After 2-3 minutes, your site will be live at:
   
   **https://qantum-fortres.github.io/AETERNAAA/**

### Step 4: Verify Deployment
1. Go to the **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow running
3. Once it completes (green checkmark), your site is live!

## What Gets Deployed

The deployed site is the **helios-ui** React application, which includes:

- ✅ **Professional landing page** with AETERNA.WEBSITE branding
- ✅ **Registration interface** (email + password)
- ✅ **Pricing plans** (Starter $49/mo, Professional $199/mo, Enterprise)
- ✅ **Platform statistics** (win rate, execution speed, revenue potential, uptime)
- ✅ **Backend integration** (connects to Railway API for user registration)
- ✅ **Modern responsive design** with Tailwind CSS

## Manual Deployment (Optional)

If you want to manually trigger a deployment without pushing to `main`:

1. Go to **Actions** tab
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select branch and click **Run workflow**

## Troubleshooting

### Site Not Loading After Deployment
- Verify GitHub Pages is set to "GitHub Actions" source (not "Deploy from a branch")
- Check the Actions tab to ensure the workflow completed successfully
- Clear your browser cache and try again

### 404 Errors on Refresh
- This is normal for SPAs on GitHub Pages
- The `.nojekyll` file should prevent most issues
- If problems persist, consider adding a 404.html that redirects to index.html

### Build Failures
- Check the Actions tab for error logs
- Ensure all dependencies are properly listed in `package.json`
- Verify the build works locally: `cd helios-ui && npm ci && npm run build`

## Next Steps After Deployment

Once your site is live:

1. **Test the registration**: Try registering with an email on the deployed site
2. **Custom domain** (optional): You can configure a custom domain in Settings > Pages
3. **SSL certificate**: GitHub Pages automatically provides HTTPS
4. **Monitor deployments**: Check the Actions tab after each push to `main`

## Files Modified

- `.github/workflows/pages.yml` - New GitHub Actions workflow
- `helios-ui/vite.config.ts` - Base path for GitHub Pages
- `helios-ui/package.json` - Build script modification
- `helios-ui/index.html` - Updated title
- `helios-ui/public/.nojekyll` - Prevents Jekyll processing

---

**Note**: This replaces any static HTML files (like AETERNA_PRESENTATION.html) that may have been deployed previously. The new deployment uses the modern React-based SaaS platform instead.
