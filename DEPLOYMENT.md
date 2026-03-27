# Deployment Guide - Store Audit App

This guide will help you deploy the Store Audit App to GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (free: https://vercel.com)
- Google Drive credentials (already configured)

## Step 1: Push to GitHub

### Option A: Using GitHub CLI

1. Install GitHub CLI: https://cli.github.com
2. Authenticate: `gh auth login`
3. Create a new repository:
   ```bash
   gh repo create Store-Audit-App --public --source=. --remote=origin --push
   ```

### Option B: Using Git Commands

1. Create a new repository on GitHub (https://github.com/new):
   - Name: `Store-Audit-App`
   - Description: `Store Audit Data Collection Tool`
   - Choose "Public"
   - Don't initialize with README (we have one)

2. In your project directory, run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/Store-Audit-App.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Method 1: Using Vercel Web UI (Recommended)

1. Visit https://vercel.com/new
2. Click "Import Project"
3. Paste your GitHub repository URL: `https://github.com/YOUR_USERNAME/Store-Audit-App`
4. Click "Continue"
5. Configure Environment Variables:
   - Add all variables from `.env.example`:
     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: audit-uploader@store-audit-app-491509.iam.gserviceaccount.com
     - `GOOGLE_PRIVATE_KEY`: (paste your private key with literal \n)
     - `GOOGLE_PROJECT_ID`: store-audit-app-491509
     - `GOOGLE_DRIVE_FOLDER_ID`: 1eFd1HeYtI5_seWf8Wh5s3VfQrsJ01tCF
     - `DATABASE_PATH`: ./audit.db
6. Click "Deploy"
7. Wait for deployment to complete
8. You'll get a URL like: `https://your-app-name.vercel.app`

### Method 2: Using Vercel CLI

1. Install Vercel CLI: `npm install -g vercel`
2. Authenticate: `vercel auth login`
3. Deploy: `vercel`
4. Follow the prompts to set up the project
5. Add environment variables when prompted

## Step 3: Configure Environment Variables in Vercel

If environment variables weren't set during deployment:

1. Go to your project on vercel.com
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_PROJECT_ID`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `DATABASE_PATH`

⚠️ **Important for GOOGLE_PRIVATE_KEY:**
- Use the exact private key from the JSON file
- Keep the newlines as literal `\n` characters (don't use actual line breaks)
- Wrap in quotes

## Step 4: Test Your Deployment

1. Visit your Vercel URL (e.g., https://store-audit-app.vercel.app)
2. Test the form submission:
   - Fill in all required fields
   - Upload a test image
   - Submit the form
3. Check Records page to verify data was saved
4. Click Export CSV to verify export works

## Troubleshooting

### Database Error on Vercel

**Problem**: "Cannot create database" error

**Solution**: Vercel's filesystem is ephemeral. For production, use:
- PostgreSQL (free tier: Railway, Supabase)
- MongoDB Atlas (free tier available)
- Neon DB (free tier)

Temporary workaround: The app will work but data won't persist between deployments.

### Image Upload Fails

**Problem**: Images not uploading to Google Drive

**Solutions**:
1. Verify Google Drive credentials in environment variables
2. Check that the Drive folder ID is correct
3. Ensure the service account has permission to write to the folder
4. Check Vercel logs: Settings → Logs

### Module Not Found Errors

**Solution**: The dependency might not have installed correctly. Redeploy:
1. Go to Deployments tab
2. Click on the latest deployment
3. Click the "..." menu
4. Click "Redeploy"

## Making Updates

After making code changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```

2. Vercel will automatically redeploy on push to main

## Next Steps for Production

1. **Replace SQLite with a cloud database**:
   - Set up PostgreSQL on Neon DB
   - Update connection in `lib/db.js`

2. **Add authentication**:
   - Implement NextAuth.js or Clerk
   - Protect audit submission and export routes

3. **Monitor and logging**:
   - Set up error tracking (Sentry)
   - Monitor performance (New Relic, DataDog)

4. **Custom domain**:
   - In Vercel project Settings → Domains
   - Add your custom domain

## Support

For Vercel deployment issues:
- Vercel Docs: https://vercel.com/docs
- Support: https://vercel.com/support

For app-specific issues:
- Check `pages/api/*` for API route errors
- Check browser console for frontend errors
- Review Vercel Function logs
