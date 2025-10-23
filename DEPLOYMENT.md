# Cloud Deployment Guide
## Campaign CRM - Hugging Face + RunPod + MongoDB Atlas

This guide walks you through deploying Campaign CRM to the cloud for FREE (using your $10 RunPod credit).

---

## Architecture Overview

```
┌─────────────────────────┐
│  Hugging Face Spaces    │  ← Frontend (React) - Always Free
│  (Static Hosting)       │
└───────────┬─────────────┘
            │
            │ API Requests
            ▼
┌─────────────────────────┐
│  RunPod Pod             │  ← Backend (Express) - Pay per use
│  (Docker Container)     │
└───────────┬─────────────┘
            │
            │ Database Queries
            ▼
┌─────────────────────────┐
│  MongoDB Atlas          │  ← Database - Free Tier (512MB)
│  (Cloud Database)       │
└─────────────────────────┘
```

**Key Points:**
- Frontend is ALWAYS on (free)
- Backend runs only when you start the RunPod pod (costs ~$0.10-0.20/hour)
- Database is ALWAYS on (free up to 512MB)
- You manually start/stop the RunPod pod to control costs

---

## Prerequisites

1. **GitHub Account** (to version control your code)
2. **Hugging Face Account** (free) - https://huggingface.co/join
3. **RunPod Account** with $10 credit - https://www.runpod.io/
4. **MongoDB Atlas Account** (free) - https://www.mongodb.com/cloud/atlas/register

---

## Part 1: Setup MongoDB Atlas (Database)

### Step 1: Create a Free Cluster
1. Go to https://cloud.mongodb.com/
2. Click "Build a Database"
3. Choose **M0 FREE** tier
4. Select a region close to where RunPod pods are available (e.g., US East)
5. Name your cluster (e.g., "campaign-crm-cluster")
6. Click "Create"

### Step 2: Create Database User
1. In the Security tab, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `campaign-crm-user` (or your choice)
5. **IMPORTANT**: Save the password securely
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 3: Allow Network Access
1. In the Security tab, click "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: This is less secure but simpler for RunPod. For production, whitelist specific IPs.
4. Click "Confirm"

### Step 4: Get Connection String
1. Go back to "Database" tab
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://...`)
5. **IMPORTANT**: Replace `<password>` in the string with your actual password
6. **IMPORTANT**: Replace `<database>` with `campaign-crm`

Example: `mongodb+srv://campaign-crm-user:MyPass123@cluster0.abc123.mongodb.net/campaign-crm?retryWrites=true&w=majority`

**Save this connection string - you'll need it later!**

---

## Part 2: Deploy Backend to RunPod

### Step 1: Prepare Environment File
On your local machine (in the `cloud` branch):

```bash
# Make sure you're on the cloud branch
git checkout cloud

# Copy the cloud environment template
cp .env.cloud .env

# Edit .env and update these values:
# - MONGODB_URI: Your MongoDB Atlas connection string from Part 1
# - FRONTEND_URL: Leave as placeholder for now (we'll update after frontend is deployed)
# - JWT_SECRET: Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Build and Push Docker Image

```bash
# Build the Docker image for backend
docker build -f Dockerfile.backend -t campaign-crm-backend:latest .

# Tag it for Docker Hub (replace 'yourusername' with your Docker Hub username)
docker tag campaign-crm-backend:latest yourusername/campaign-crm-backend:latest

# Login to Docker Hub
docker login

# Push the image
docker push yourusername/campaign-crm-backend:latest
```

**Don't have Docker Hub?** Create a free account at https://hub.docker.com/signup

### Step 3: Create RunPod Pod

1. Go to https://www.runpod.io/console/pods
2. Click "Deploy" (or "New Pod")
3. Choose **CPU Instance** (cheapest option, ~$0.10/hour)
   - Look for "1x vCPU" or "2x vCPU" options
4. Select a region with availability
5. In "Docker Image Name", enter: `yourusername/campaign-crm-backend:latest`
6. Click "Customize Deployment"
7. Expose Ports: Add port `5000` (HTTP)
8. Environment Variables: Add these:
   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your-generated-secret
   FRONTEND_URL=https://placeholder.hf.space
   ```
9. Click "Deploy"

### Step 4: Get Backend URL

1. Once the pod is running, go to pod details
2. Find the "Connect" section
3. Look for "HTTP Service" or "TCP Port Mappings"
4. You'll see a URL like: `https://abc123-5000.proxy.runpod.net`
5. **Test it**: Open `https://your-pod-url/api/health` in a browser
   - You should see: `{"status":"OK","message":"Campaign CRM API is running",...}`

**Save this URL - you need it for the frontend!**

---

## Part 3: Deploy Frontend to Hugging Face Spaces

### Step 1: Build Frontend with Backend URL

```bash
# Still on the cloud branch
git checkout cloud

# Copy frontend environment template
cp .env.frontend.cloud .env.production

# Edit .env.production
# Change REACT_APP_API_URL to your RunPod URL from Part 2, Step 4
# Example: REACT_APP_API_URL=https://abc123-5000.proxy.runpod.net/api
nano .env.production  # or use your preferred editor

# Build the React app
npm run build
```

This creates a `build/` folder with all the static files.

### Step 2: Create Hugging Face Space

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Space name: `campaign-crm` (or your choice)
4. Choose **Static** as the Space SDK
5. Choose Public or Private visibility
6. Click "Create Space"

### Step 3: Upload Files

**Option A: Web Interface (easier)**
1. In your new Space, click "Files" tab
2. Click "Add file" → "Upload files"
3. **IMPORTANT**: Upload ALL contents of the `build/` folder
   - Drag and drop the entire contents of `build/` (not the folder itself)
   - This includes: index.html, static/, manifest.json, etc.
4. Click "Commit changes to main"

**Option B: Git (advanced)**
```bash
# Clone the Space repository
git clone https://huggingface.co/spaces/your-username/campaign-crm
cd campaign-crm

# Copy build files
cp -r ../campaign-crm/build/* .

# Commit and push
git add .
git commit -m "Deploy frontend"
git push
```

### Step 4: Get Frontend URL

1. After upload, HF will build your Space (takes ~1 minute)
2. Your Space URL will be: `https://huggingface.co/spaces/your-username/campaign-crm`
3. Or the embedded version: `https://your-username-campaign-crm.hf.space`

**Test it**: Open your Space URL. The frontend should load (but API calls will fail until we update CORS).

---

## Part 4: Connect Frontend and Backend

### Step 1: Update Backend CORS

Now that you have your HF Space URL, update the backend:

1. Go to RunPod console
2. Stop your pod
3. Edit the pod configuration
4. Update environment variable:
   ```
   FRONTEND_URL=https://your-username-campaign-crm.hf.space
   ```
   (Use the exact URL from Part 3, Step 4)
5. Start the pod again

### Step 2: Test the Full Application

1. Open your Hugging Face Space URL
2. The app should now work fully!
3. Try creating a campaign or contact to verify the API connection

---

## Cost Management

### Starting and Stopping RunPod

**To START the backend:**
1. Go to RunPod console
2. Find your pod
3. Click "Start"
4. Wait ~30 seconds for it to boot

**To STOP the backend (save money):**
1. Go to RunPod console
2. Find your pod
3. Click "Stop"
4. **You only pay for runtime!**

### Estimated Costs with $10 Credit

- **Cost per hour**: ~$0.10 - $0.20 (depending on instance)
- **$10 credit**: ~50-100 hours of runtime
- **If you use 2 hours/day**: ~25-50 days

**Pro Tip**: Stop the pod when you're not using the app!

---

## Troubleshooting

### Frontend shows "Network Error" or "Failed to fetch"

**Cause**: Backend is not running or CORS is misconfigured

**Solution**:
1. Check if RunPod pod is running
2. Test backend health: `https://your-runpod-url/api/health`
3. Check browser console for CORS errors
4. Verify `FRONTEND_URL` in RunPod matches your HF Space URL exactly

### Backend returns 500 errors

**Cause**: Database connection failed

**Solution**:
1. Check MongoDB Atlas connection string is correct
2. Verify database user password
3. Check Network Access in MongoDB Atlas (0.0.0.0/0 should be allowed)
4. Check RunPod pod logs for connection errors

### "Cannot read property of undefined" in frontend

**Cause**: API URL is incorrect or build is stale

**Solution**:
1. Verify `.env.production` has correct `REACT_APP_API_URL`
2. Rebuild frontend: `npm run build`
3. Re-upload build files to HF Space

### RunPod pod won't start

**Cause**: Docker image pull failed or port conflict

**Solution**:
1. Verify Docker image name is correct
2. Check Docker Hub image is public
3. Try a different RunPod region
4. Check port 5000 is correctly exposed

---

## Updating Your Deployment

### Update Frontend
```bash
# Make changes to React code
git checkout cloud
# ... edit files ...

# Rebuild
npm run build

# Re-upload build/ folder to HF Space
```

### Update Backend
```bash
# Make changes to server code
git checkout cloud
# ... edit files ...

# Rebuild Docker image
docker build -f Dockerfile.backend -t yourusername/campaign-crm-backend:latest .
docker push yourusername/campaign-crm-backend:latest

# Restart RunPod pod (it will pull the new image)
```

---

## Security Notes

1. **NEVER commit `.env` files to git** - they contain secrets
2. Use strong passwords for MongoDB users
3. For production, use IP whitelisting instead of 0.0.0.0/0
4. Rotate JWT secrets periodically
5. The RunPod pod URL changes if you recreate the pod

---

## Summary

✅ **What you've deployed:**
- Frontend: Hugging Face Spaces (free, always-on)
- Backend: RunPod (pay-per-use with your $10 credit)
- Database: MongoDB Atlas (free tier, always-on)

✅ **How to use it:**
- Start RunPod pod when you need the app
- Stop RunPod pod when you're done
- Frontend and database are always available

✅ **Your $10 RunPod credit should last weeks if you manage it well!**

---

**Need help?** Check the specific README files:
- `README.HuggingFace.md` - Frontend deployment details
- `Dockerfile.backend` - Backend container configuration
- `.env.cloud` - Environment variables explained
