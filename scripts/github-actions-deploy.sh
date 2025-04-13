#!/bin/bash

# Script for GitHub Actions deployment to SpacetimeDB Maincloud
# This script is designed to be run in CI/CD environments (GitHub Actions)

# Exit on error
set -e

# Check if required environment variables are set
if [ -z "$SPACETIME_MODULE_NAME" ]; then
  echo "Error: SPACETIME_MODULE_NAME not set in GitHub secrets"
  exit 1
fi

if [ -z "$SPACETIME_AUTH_TOKEN" ]; then
  echo "Error: SPACETIME_AUTH_TOKEN not set in GitHub secrets"
  exit 1
fi

# Install SpacetimeDB CLI if not already installed
if ! command -v spacetime &> /dev/null; then
  echo "Installing SpacetimeDB CLI..."
  curl -fsSL https://spacetimedb.com/install | bash
  export PATH=$PATH:$HOME/.spacetime/bin
fi

# Log in to SpacetimeDB with token
echo "Authenticating with SpacetimeDB..."
echo "$SPACETIME_AUTH_TOKEN" | spacetime identity login --token-stdin

# Build the server module
echo "Building server module..."
cd server
dotnet build -c Release

# Deploy to SpacetimeDB Maincloud
echo "Deploying to SpacetimeDB Maincloud..."
spacetime publish -s maincloud $SPACETIME_MODULE_NAME

echo "Deployment successful!"
echo "Module is available at: https://spacetimedb.com/modules/$SPACETIME_MODULE_NAME"
