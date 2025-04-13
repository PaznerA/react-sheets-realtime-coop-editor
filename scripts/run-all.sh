#!/bin/bash
set -e

# Process command line arguments
PRUNE_DB=false
SKIP_TESTS=false

for arg in "$@"; do
  case $arg in
    --prune-db)
      PRUNE_DB=true
      shift
      ;;
    --no-test)
      SKIP_TESTS=true
      shift
      ;;
  esac
done

# Check for .env.local first, then .env.example
if [ -f .env.local ]; then
  echo "📝 Loading environment from .env.local file..."
  export $(grep -v '^#' .env.local | xargs)
elif [ -f .env ]; then
  echo "📝 Loading environment from .env file (consider moving to .env.local)..."
  export $(grep -v '^#' .env | xargs)
  # Copy .env to .env.local to encourage using .env.local instead
  cp .env .env.local
fi

# Set local development defaults if not specified
SPACETIME_HOST=${SPACETIME_HOST:-"localhost"}
SPACETIME_PORT=${SPACETIME_PORT:-3000}
MODULE_NAME=${MODULE_NAME:-"spacetime-sheets"}
SERVER_NICKNAME="spacetime-sheets-local"
SERVER_URL="http://$SPACETIME_HOST:$SPACETIME_PORT"

# Build the server module
echo "📦 Building server module..."
cd server

# Ignore the Tests.cs file by temporarily moving it
if [ -f Tests.cs ]; then
  echo "🧩 Temporarily moving Tests.cs aside..."
  mv Tests.cs Tests.cs.bak
fi

echo "🔨 Building server module..."
spacetime build --debug

# Check if build was successful
if [ $? -ne 0 ]; then
  # Restore Tests.cs if it was moved (to ensure it's restored even on failure)
  if [ -f Tests.cs.bak ]; then
    mv Tests.cs.bak Tests.cs
  fi
  echo "❌ Server build failed!"
  exit 1
fi

echo "✅ Server build successful!"

# Stay in server directory to generate TypeScript bindings
echo "🔧 Generating TypeScript bindings..."
WASM_PATH="bin/Debug/net8.0/wasi-wasm/AppBundle/StdbModule.wasm"

if [ ! -f "$WASM_PATH" ]; then
  # Restore Tests.cs if it was moved
  if [ -f Tests.cs.bak ]; then
    mv Tests.cs.bak Tests.cs
  fi
  echo "❌ WASM file not found at $WASM_PATH!"
  echo "🔍 Searching for WASM files..."
  find . -name "*.wasm" -type f
  exit 1
fi

cd ..
spacetime generate -l typescript -b "server/$WASM_PATH" -o src/module_bindings/generated

echo "✅ TypeScript bindings generated!"

# Check if server is already running
if pgrep -f "spacetime.*serve" > /dev/null; then
  echo "🔄 SpacetimeDB server is already running, restarting..."
  pkill -f "spacetime.*serve" || true
  sleep 2
fi

# Remove existing PID lock file if it exists
if [ -f "${HOME}/.spacetime/standalone/spacetime.pid" ]; then
  echo "🔒 Removing existing spacetime.pid lock..."
  rm "${HOME}/.spacetime/standalone/spacetime.pid"
fi

# Start a local SpacetimeDB server
echo "🚀 Starting SpacetimeDB server on $SPACETIME_HOST:$SPACETIME_PORT..."
spacetime start > logs/spacetime_server.log 2>&1 &
SPACETIME_PID=$!
echo $SPACETIME_PID > .spacetime_pid
echo "📝 SpacetimeDB server running with PID: $SPACETIME_PID"
sleep 3  # Wait for server to start

# Set up server configuration
echo "🛠️ Setting up server configuration..."

# Check if server configuration already exists
if spacetime server list | grep -q "$SERVER_NICKNAME"; then
  echo "ℹ️ Server configuration for '$SERVER_NICKNAME' already exists."
  echo "🔄 Updating URL to $SERVER_URL..."
  spacetime server remove "$SERVER_NICKNAME" || true
  spacetime server add --url "$SERVER_URL" --no-fingerprint "$SERVER_NICKNAME"
else
  echo "ℹ️ Creating new server configuration '$SERVER_NICKNAME'..."
  spacetime server add --url "$SERVER_URL" --no-fingerprint "$SERVER_NICKNAME"
  
  if [ $? -ne 0 ]; then
    echo "⚠️ Server configuration failed, but continuing anyway..."
  fi
fi

# Deploy to local SpacetimeDB - IMPORTANT: Tests.cs must still be moved aside
echo "📋 Publishing to local SpacetimeDB..."
# Must run in the server/ directory, where the module code is located
cd server
# Ensure Tests.cs is still moved aside during publish
if [ -f Tests.cs.bak ]; then
  echo "🧩 Tests.cs is still temporarily moved aside..."
else
  echo "🧩 Moving Tests.cs aside before publishing..."
  [ -f Tests.cs ] && mv Tests.cs Tests.cs.bak
fi

# Try to publish
spacetime publish -s "$SERVER_NICKNAME" "$MODULE_NAME"
PUBLISH_RESULT=$?

# Always restore Tests.cs
if [ -f Tests.cs.bak ]; then
  echo "🔄 Restoring Tests.cs..."
  mv Tests.cs.bak Tests.cs
fi

# Check publish result
if [ $PUBLISH_RESULT -ne 0 ]; then
  echo "❌ Local deployment failed!"
  exit 1
fi

echo "✅ Local deployment successful!"
echo "🔗 Module is running at: $SERVER_URL"
cd ..

# Start frontend
echo "🖥️ Starting frontend server..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > .frontend_pid
echo "📝 Frontend server running with PID: $FRONTEND_PID"

echo "⏳ Waiting for frontend to start..."
sleep 5

# Run tests if not skipped
if [ "$SKIP_TESTS" = false ]; then
  echo "🧪 Running Playwright tests..."
  npm run test:e2e
  TEST_EXIT_CODE=$?
  
  if [ $TEST_EXIT_CODE -ne 0 ]; then
    echo "❌ Some tests failed (exit code $TEST_EXIT_CODE)"
  else
    echo "✅ All tests passed!"
  fi
else
  echo "🚫 Tests skipped as requested."
fi

# Merge logs in real-time
echo "📋 Showing live logs from both servers. Press Ctrl+C to stop."
echo "----------------------------------------"

# Function to display logs with prefix
show_logs() {
  local log_file=$1
  local prefix=$2
  tail -f "$log_file" | sed "s/^/[$prefix] /" &
  return $!
}

# Start showing logs
show_logs logs/spacetime_server.log "BACKEND "
show_logs logs/frontend.log "FRONTEND" 

echo "=========================================="
echo "🚀 Everything is running! Press Ctrl+C to stop all processes..."
echo "=========================================="

# Wait for user to press Ctrl+C
wait