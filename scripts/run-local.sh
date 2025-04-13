#!/bin/bash

# Script to run SpacetimeSheets locally with SpacetimeDB
# This script will build and run the server module with a local SpacetimeDB instance

# Load environment variables
if [ -f .env ]; then
  source .env
else
  echo "Error: .env file not found. Please create one with your SpacetimeDB configuration."
  exit 1
fi

# Check if required environment variables are set
if [ -z "$SPACETIME_MODULE_NAME" ]; then
  echo "Error: SPACETIME_MODULE_NAME not set in .env"
  exit 1
fi

# Set local development defaults if not specified
SPACETIME_HOST=${SPACETIME_HOST:-"localhost"}
SPACETIME_PORT=${SPACETIME_PORT:-3000}
SERVER_NICKNAME="spacetime-sheets-local"
SERVER_URL="http://$SPACETIME_HOST:$SPACETIME_PORT"

# Build the server module
echo "📦 Building server module..."
cd server

# Use debug mode for faster builds during development
spacetime build --debug

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Server build failed!"
  exit 1
fi

echo "✅ Server build successful!"

# Start a local SpacetimeDB server
echo "🚀 Starting local SpacetimeDB server..."

# Check if server is already running
if nc -z $SPACETIME_HOST $SPACETIME_PORT 2>/dev/null; then
  echo "ℹ️ SpacetimeDB server is already running on $SPACETIME_HOST:$SPACETIME_PORT"
else
  echo "ℹ️ Starting SpacetimeDB server on $SPACETIME_HOST:$SPACETIME_PORT"
  
  # Start SpacetimeDB server in the background
  spacetime start &
  
  # Store the PID of the server process
  SPACETIME_SERVER_PID=$!
  
  # Wait for server to start
  echo "⏳ Waiting for server to start..."
  sleep 5
  
  # Check if server started successfully
  if ! nc -z $SPACETIME_HOST $SPACETIME_PORT 2>/dev/null; then
    echo "❌ Failed to start SpacetimeDB server!"
    exit 1
  fi
  
  echo "✅ SpacetimeDB server started successfully!"
fi

# Set up server configuration
echo "🛠️ Setting up server configuration..."

# Check if server configuration already exists
if spacetime server list | grep -q "$SERVER_NICKNAME"; then
  echo "ℹ️ Server configuration for '$SERVER_NICKNAME' already exists."
else
  echo "ℹ️ Creating new server configuration '$SERVER_NICKNAME'..."
  spacetime server add --url "$SERVER_URL" --no-fingerprint "$SERVER_NICKNAME"
  
  if [ $? -ne 0 ]; then
    echo "⚠️ Server configuration failed, but continuing anyway..."
  fi
fi

# Deploy to local SpacetimeDB
echo "📋 Deploying to local SpacetimeDB..."
spacetime publish -s "$SERVER_NICKNAME" "$SPACETIME_MODULE_NAME"

# Check deployment result
if [ $? -ne 0 ]; then
  echo "❌ Local deployment failed!"
  exit 1
fi

echo "✅ Local deployment successful!"
echo "🔗 Your module should be running at: $SERVER_URL"

# Start frontend
cd ..
echo "🖥️ Starting frontend..."
echo "ℹ️ Make sure your .env.local file has these values:"
echo "VITE_SPACETIME_HOST=$SPACETIME_HOST"
echo "VITE_SPACETIME_PORT=$SPACETIME_PORT"
echo "VITE_SPACETIME_MODULE=$SPACETIME_MODULE_NAME"

npm run dev
