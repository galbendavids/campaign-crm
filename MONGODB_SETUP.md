# MongoDB Setup Instructions

## The Issue
If you're seeing errors like:
- "Failed to fetch campaigns: Request failed with status code 500"
- "Database connection failed. Please ensure MongoDB is running and accessible."
- "Cannot connect to MongoDB. Please start MongoDB service."

This means MongoDB is not running on your system.

## Quick Fix

### Option 1: Use Docker (Easiest - Recommended)

If you have Docker installed, this is the simplest solution:

```bash
# Start MongoDB with our helper script
./start-mongodb.sh

# Or manually:
docker run -d --name campaign-crm-mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:7.0
```

**Managing MongoDB:**
```bash
# Stop MongoDB
docker stop campaign-crm-mongodb

# Start MongoDB again
docker start campaign-crm-mongodb

# View logs
docker logs campaign-crm-mongodb

# Remove container (data is preserved in volume)
docker rm campaign-crm-mongodb
```

### Option 2: Install MongoDB locally

**On macOS:**
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify it's running
brew services list | grep mongodb
```

**On Ubuntu/Linux:**
```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb

# Start MongoDB service  
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify it's running
sudo systemctl status mongod
```

**On Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB should start automatically as a service

### Option 2: Use MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Create a `.env` file in your project root:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campaign-crm
   ```

## Verification

After setting up MongoDB, you can verify the connection by:

1. Starting your server: `npm run dev` or `npm run server`
2. Checking the health endpoint: `curl http://localhost:5000/api/health`
3. You should see: `{"status":"OK","message":"Campaign CRM API is running","database":"connected"}`

## Common Issues

- **Port 27017 already in use**: Another MongoDB instance might be running
- **Permission denied**: Try running with sudo (Linux) or check file permissions
- **Connection timeout**: Check if MongoDB service is actually running

Need help? Check the MongoDB documentation: https://docs.mongodb.com/manual/installation/