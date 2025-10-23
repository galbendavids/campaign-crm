# Campaign CRM - Hugging Face Spaces Deployment

This is the **frontend only** deployment of Campaign CRM on Hugging Face Spaces.

## About This Space

This Space hosts the React frontend (static files) of Campaign CRM. The backend API is deployed separately on RunPod.

### Architecture
- **Frontend**: Hugging Face Spaces (Static)
- **Backend API**: RunPod (see backend deployment docs)
- **Database**: MongoDB Atlas (Free Tier)

## Setup Instructions

### 1. Build the React App
Before uploading to Hugging Face, you need to build the production version:

```bash
# Make sure you're on the 'cloud' branch
git checkout cloud

# Create .env.production with your RunPod API endpoint
# Copy from .env.frontend.cloud and update the URL
cp .env.frontend.cloud .env.production
# Edit .env.production and set REACT_APP_API_URL to your RunPod endpoint

# Build the React app
npm run build
```

### 2. Upload to Hugging Face Spaces

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Choose "Static" as the Space type
4. Upload ALL files from the `build/` folder to the Space
5. The Space will automatically deploy

### 3. Update Backend CORS

After your Space is live, you need to update the backend:

1. Note your Space URL (e.g., `https://your-username-campaign-crm.hf.space`)
2. Update the `FRONTEND_URL` environment variable in your RunPod deployment
3. Restart the RunPod container

## File Structure for Upload

Upload these files from the `build/` folder:
```
build/
├── index.html (main entry point)
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── manifest.json
├── robots.txt
└── asset-manifest.json
```

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
- Check that the backend `FRONTEND_URL` matches your HF Space URL exactly
- Restart the RunPod container after changing environment variables

### API Connection Errors
- Verify the `REACT_APP_API_URL` in `.env.production` points to your RunPod endpoint
- Check that your RunPod pod is running
- Test the backend health endpoint: `https://your-runpod-url/api/health`

### Build Issues
- Make sure all dependencies are installed: `npm install`
- Clear cache and rebuild: `rm -rf build/ && npm run build`

## Updating the Deployment

To update the frontend:
1. Make changes to the React code
2. Rebuild: `npm run build`
3. Re-upload the `build/` folder contents to your HF Space
4. The Space will automatically redeploy

---

**Note**: This is a static deployment. No server-side code runs on Hugging Face. All API requests go to the RunPod backend.
