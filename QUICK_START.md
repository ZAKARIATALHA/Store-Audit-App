# Quick Start - Store Audit App Deployment

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `Store-Audit-App`
3. Description: `Store Audit Data Collection Tool`
4. Select **Public**
5. Click **Create repository**

### Step 2: Push Code to GitHub

Open terminal/command prompt in the Store-Audit-App directory and run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/Store-Audit-App.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Visit https://vercel.com/new
2. Click **Import Project**
3. Paste: `https://github.com/YOUR_USERNAME/Store-Audit-App`
4. Click **Continue**
5. **Configure Build Settings** (default is fine, just click Next)
6. **Add Environment Variables**:

Click "Add Environment Variable" for each:

| Name | Value |
|------|-------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `audit-uploader@store-audit-app-491509.iam.gserviceaccount.com` |
| `GOOGLE_PROJECT_ID` | `store-audit-app-491509` |
| `GOOGLE_DRIVE_FOLDER_ID` | `1eFd1HeYtI5_seWf8Wh5s3VfQrsJ01tCF` |
| `DATABASE_PATH` | `./audit.db` |
| `GOOGLE_PRIVATE_KEY` | (See next section) |

### Step 3a: Add Google Private Key

For `GOOGLE_PRIVATE_KEY`, use your private key exactly as provided, wrapped in quotes:

```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...(rest of key)...-----END PRIVATE KEY-----\n"
```

⚠️ **Important**: Keep the `\n` as literal text (don't use actual line breaks)

7. Click **Deploy**
8. Wait for deployment to complete (usually 2-3 minutes)
9. You'll see: **"Congratulations! Your project has been successfully deployed"**
10. Click the project name or visit the URL provided

### Step 4: Test Your App

Once deployed:

1. **New Audit**: Fill form and submit test audit
2. **Records**: View submitted records
3. **Export CSV**: Download all records
4. **Image Upload**: Test camera/image upload (Google Drive)

---

## Your Live App URL

After deployment, your URL will be:
```
https://store-audit-app.vercel.app
```

Or if custom domain:
```
https://your-custom-domain.com
```

---

## Troubleshooting

### Build Failed?
- Check Environment Variables are set correctly
- View Logs in Vercel Dashboard: Settings → Logs
- Common issues: Missing GOOGLE_PRIVATE_KEY

### Image Upload Not Working?
- Verify Google Drive credentials
- Check service account has access to the folder
- View Function logs in Vercel: Deployments → Details → Logs

### Data Not Persisting?
- On Vercel, data is stored in-memory between requests
- For production: Use PostgreSQL (free on Neon DB, Railway)
- See DEPLOYMENT.md for database solutions

---

## Next Steps

### Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Update Code

1. Make changes locally
2. `git add .`
3. `git commit -m "Your message"`
4. `git push`
5. Vercel auto-deploys on push to main ✅

### Add Custom Domain

In Vercel project:
1. Settings → Domains
2. Enter your custom domain
3. Follow DNS setup instructions

### Database Upgrade

To persist data in production:

**Option 1: PostgreSQL (Recommended)**
- Neon DB: https://neon.tech (free tier)
- Railway: https://railway.app
- Supabase: https://supabase.com

**Option 2: MongoDB**
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas (free tier)

Update `lib/storage.js` to use your chosen database.

---

## Support

**Vercel Issues?**
- https://vercel.com/docs
- https://vercel.com/support

**Google Drive Issues?**
- https://developers.google.com/drive/api/guides

**App Issues?**
- Check browser DevTools (F12) → Console for errors
- Check Vercel Logs for backend errors

---

## Environment Variables Reference

```
# Google Drive (provided)
GOOGLE_SERVICE_ACCOUNT_EMAIL=audit-uploader@store-audit-app-491509.iam.gserviceaccount.com
GOOGLE_PROJECT_ID=store-audit-app-491509
GOOGLE_DRIVE_FOLDER_ID=1eFd1HeYtI5_seWf8Wh5s3VfQrsJ01tCF
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Database
DATABASE_PATH=./audit.db
```

---

**That's it! Your Store Audit App is now live! 🎉**
