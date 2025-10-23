#!/bin/bash

echo "🚀 Starting MongoDB for Campaign CRM..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    echo "   You can start it by running: open -a Docker"
    echo "   Then wait about 30 seconds and run this script again."
    exit 1
fi

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^campaign-crm-mongodb$"; then
    echo "📦 MongoDB container already exists"
    
    # Check if it's running
    if docker ps --format '{{.Names}}' | grep -q "^campaign-crm-mongodb$"; then
        echo "✅ MongoDB is already running!"
    else
        echo "▶️  Starting existing MongoDB container..."
        docker start campaign-crm-mongodb
        echo "✅ MongoDB started successfully!"
    fi
else
    echo "📥 Creating and starting new MongoDB container..."
    docker run -d \
      --name campaign-crm-mongodb \
      -p 27017:27017 \
      -v mongodb_data:/data/db \
      -e MONGO_INITDB_DATABASE=campaign-crm \
      mongo:7.0
    echo "✅ MongoDB started successfully!"
fi

echo ""
echo "🎯 MongoDB is now running on: mongodb://localhost:27017"
echo "📊 Database name: campaign-crm"
echo ""
echo "To stop MongoDB, run: docker stop campaign-crm-mongodb"
echo "To view logs, run: docker logs campaign-crm-mongodb"
