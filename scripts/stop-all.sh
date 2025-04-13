#!/bin/bash

echo "🛑 Stopping SpacetimeDB server and frontend server..."

# Terminate the SpacetimeDB server by PID file
if [ -f .spacetime_pid ]; then
  SPACETIME_PID=$(cat .spacetime_pid)
  echo "🔪 Terminating SpacetimeDB server (PID: $SPACETIME_PID)..."
  kill -9 $SPACETIME_PID 2>/dev/null || true
  rm .spacetime_pid
  echo "✅ SpacetimeDB server terminated."
else
  echo "ℹ️ .spacetime_pid file not found, trying to find process..."
  # Fallback method - using pgrep
  if pgrep -f "spacetime.*serve" > /dev/null; then
    echo "🔪 Terminating found SpacetimeDB server using pgrep..."
    pkill -9 -f "spacetime.*serve"
    echo "✅ SpacetimeDB server terminated."
  else
    echo "ℹ️ SpacetimeDB server is not running."
  fi
fi

# Terminate npm process by PID file
if [ -f .frontend_pid ]; then
  FRONTEND_PID=$(cat .frontend_pid)
  echo "🔪 Terminating frontend server (PID: $FRONTEND_PID)..."
  kill -9 $FRONTEND_PID 2>/dev/null || true
  rm .frontend_pid
  echo "✅ Frontend server terminated."
else
  echo "ℹ️ .frontend_pid file not found, trying to find process..."
  # Fallback method - using pgrep
  if pgrep -f "vite.*dev" > /dev/null; then
    echo "🔪 Terminating found frontend server using pgrep..."
    pkill -9 -f "vite.*dev"
    echo "✅ Frontend server terminated."
  else
    echo "ℹ️ Frontend server is not running."
  fi
fi

# Also terminate any child processes that might be hanging
echo "🧹 Checking for any other processes..."
if pgrep -f "spacetime" > /dev/null; then
  echo "🔪 Terminating remaining spacetime processes..."
  pkill -f "spacetime"
fi

if pgrep -f "vite" > /dev/null; then
  echo "🔪 Terminating remaining vite processes..."
  pkill -f "vite"
fi

# Remove PID file
if [ -f "${HOME}/.spacetime/standalone/spacetime.pid" ]; then
  echo "🧹 Removing spacetime.pid file..."
  rm "${HOME}/.spacetime/standalone/spacetime.pid"
fi

echo "🧹 Cleaning log files..."
# Just clear logs, not completely delete
> logs/spacetime_server.log
> logs/frontend.log

echo "👋 All processes terminated!"
