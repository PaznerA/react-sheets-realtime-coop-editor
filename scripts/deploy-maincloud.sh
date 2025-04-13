#!/bin/bash

# Script to deploy SpacetimeSheets to SpacetimeDB Maincloud
# This script will build and deploy the server module to SpacetimeDB Maincloud

# Load environment variables
if [ -f .env ]; then
  source .env
else
  echo "Error: .env file not found. Please create one with your SpacetimeDB credentials."
  exit 1
fi

# Check if SPACETIME_MODULE_NAME is set
if [ -z "$SPACETIME_MODULE_NAME" ]; then
  echo "Error: SPACETIME_MODULE_NAME not set in .env"
  exit 1
fi

# Build the server module
echo "📦 Building server module..."
cd server
dotnet build -c Release

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Server build failed!"
  exit 1
fi

echo "✅ Server build successful!"

# Deploy to SpacetimeDB Maincloud
echo "🚀 Deploying to SpacetimeDB Maincloud..."
spacetime publish -s maincloud $SPACETIME_MODULE_NAME

# Check deployment result
if [ $? -ne 0 ]; then
  echo "❌ Deployment failed!"
  exit 1
fi

echo "✅ Deployment to SpacetimeDB Maincloud successful!"
echo "🔗 Your module should be available at: https://spacetimedb.com/modules/$SPACETIME_MODULE_NAME"
echo "🌐 You can view your deployed modules at: https://spacetimedb.com/profile"

# Output client connection details
echo "ℹ️ Client connection details:"
echo "Module Name: $SPACETIME_MODULE_NAME"
echo "Host: maincloud.spacetimedb.com"
echo "To connect, update your .env.local file with these values"
