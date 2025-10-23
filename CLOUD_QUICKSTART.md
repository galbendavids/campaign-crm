# Cloud Deployment - Quick Reference

**Branch: `cloud`** - Use this branch for all cloud deployments. The `main` branch remains for local development.

---

## 🚀 Quick Deploy Commands

### 1. Deploy Backend to RunPod

```bash
# Switch to cloud branch
git checkout cloud

# Create .env from template
cp .env.cloud .env
# EDIT .env with your MongoDB Atlas URI and secrets

# Build and push Docker image
docker build -f Dockerfile.backend -t yourusername/campaign-crm-backend:latest .
docker push yourusername/campaign-crm-backend:latest

# Then create a RunPod pod with this image
```

### 2. Deploy Frontend to Hugging Face

```bash
# Create .env.production from template
cp .env.frontend.cloud .env.production
# EDIT .env.production with your RunPod API URL

# Build React app
npm run build

# Upload the build/ folder contents to your HF Space
```

---

## 📁 New Files (Cloud Branch Only)

| File | Purpose |
|------|---------|
| `Dockerfile.backend` | Backend container for RunPod |
| `.dockerignore` | Reduce Docker image size |
| `.env.cloud` | Backend environment variables template |
| `.env.frontend.cloud` | Frontend environment variables template |
| `DEPLOYMENT.md` | Complete step-by-step deployment guide |
| `README.HuggingFace.md` | HF Spaces deployment instructions |
| `CLOUD_QUICKSTART.md` | This file - quick reference |

---

## 🔄 Workflow

### Local Development (main branch)
```bash
git checkout main
npm run dev  # Runs both frontend and backend locally
```

### Cloud Deployment (cloud branch)
```bash
git checkout cloud
# Backend: Build Docker → Push to Docker Hub → Deploy to RunPod
# Frontend: Build React → Upload to Hugging Face Spaces
```

---

## 🔑 Required Accounts

1. ✅ **Docker Hub** (free) - Store backend container image
2. ✅ **MongoDB Atlas** (free) - Database
3. ✅ **RunPod** ($10 credit) - Backend hosting
4. ✅ **Hugging Face** (free) - Frontend hosting

---

## 💰 Cost Breakdown

- **Frontend**: $0 (Hugging Face free)
- **Backend**: ~$0.10-0.20/hour when running (RunPod)
- **Database**: $0 (MongoDB Atlas free tier)

**Total**: Only pay for RunPod when backend is running

---

## 🛠️ Key Changes from Main Branch

### Backend (`server/index.js`)
- ✅ CORS configured for production (allows HF Space origin)
- ✅ Still works locally with `NODE_ENV=development`

### Frontend (`src/utils/api.js`)
- ✅ Already supports `REACT_APP_API_URL` environment variable
- ✅ No code changes needed - just build with correct .env.production

### New Docker Setup
- ✅ `Dockerfile.backend` - Runs Express server only
- ✅ `.dockerignore` - Excludes frontend files

---

## 🔍 Testing

### Test Backend (RunPod)
```bash
curl https://your-runpod-url/api/health
# Should return: {"status":"OK","message":"Campaign CRM API is running",...}
```

### Test Frontend (HF Spaces)
Open `https://your-username-campaign-crm.hf.space` in browser

### Test Full Stack
Create a campaign or contact in the HF frontend - should save to database

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| CORS error in browser | Update `FRONTEND_URL` in RunPod to match HF Space URL |
| "Network Error" | Check if RunPod pod is running |
| Build fails | Check `.env.production` exists and has correct API URL |
| Docker push fails | Run `docker login` first |
| MongoDB connection fails | Check Atlas connection string and network access (0.0.0.0/0) |

---

## 📚 Full Documentation

- **Complete Guide**: `DEPLOYMENT.md` (step-by-step with screenshots context)
- **HF Spaces**: `README.HuggingFace.md`
- **Environment Setup**: `.env.cloud` and `.env.frontend.cloud`

---

## ⚡ Start/Stop Backend (Save Money!)

**Start RunPod Pod:**
- Go to RunPod console → Find your pod → Click "Start"
- Wait ~30 seconds → App is live

**Stop RunPod Pod:**
- Go to RunPod console → Find your pod → Click "Stop"
- No charges while stopped!

---

## 🔄 Update Deployment

### Update Frontend
```bash
git checkout cloud
# Edit React code
npm run build
# Re-upload build/ to HF Space
```

### Update Backend
```bash
git checkout cloud
# Edit server code
docker build -f Dockerfile.backend -t yourusername/campaign-crm-backend:latest .
docker push yourusername/campaign-crm-backend:latest
# Restart RunPod pod (pulls new image)
```

---

**Ready to deploy?** Start with `DEPLOYMENT.md` for the full walkthrough!
