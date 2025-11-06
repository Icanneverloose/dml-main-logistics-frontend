# Netlify Environment Variables Setup

## Problem
Your frontend is deployed on Netlify but can't connect to your backend on Render because the environment variable `VITE_API_BASE_URL` is not configured.

## Solution: Set Environment Variable in Netlify

### Steps to Configure:

1. **Go to your Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Select your site

2. **Navigate to Environment Variables**
   - Go to: **Site settings** → **Environment variables** (or **Build & deploy** → **Environment**)

3. **Add the Environment Variable**
   - Click **Add variable**
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-name.onrender.com/api`
     - Replace `your-backend-name` with your actual Render service name
     - Example: `https://dml-logistics-backend.onrender.com/api`
   - **Scopes**: Select **All scopes** (or at least **Production**)

4. **Redeploy Your Site**
   - After adding the variable, go to **Deploys**
   - Click **Trigger deploy** → **Clear cache and deploy site**
   - This ensures the new environment variable is used in the build

### Important Notes:

- The URL format should be: `https://your-render-service.onrender.com/api`
- Make sure to include `/api` at the end
- The variable name must be exactly `VITE_API_BASE_URL` (Vite uses the `VITE_` prefix)
- After setting the variable, you MUST redeploy for changes to take effect

### Verify Your Render Backend URL:

1. Go to your Render dashboard
2. Find your backend service
3. Copy the URL (should be something like `https://your-service.onrender.com`)
4. Add `/api` to the end for the environment variable value

### Testing:

After redeploying, test your frontend:
- Check the browser console for any connection errors
- Try to sign in or make an API request
- The error "cannot connect to backend" should be resolved

### CORS Configuration:

Also make sure your Render backend has CORS configured to allow requests from your Netlify domain:
- Your Netlify domain (e.g., `https://your-site.netlify.app`)
- If using a custom domain, include that as well

---

## Quick Reference

**Environment Variable:**
```
Key: VITE_API_BASE_URL
Value: https://your-backend-name.onrender.com/api
```

