#!/bin/bash
set -e

# Set local development defaults if not specified
MODULE_NAME=${MODULE_NAME:-"spacetime-sheets"}

echo "📦 Building server module..."
cd server

# Use spacetime build instead of dotnet build
echo "Building server module..."
spacetime build --debug

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Server build failed!"
  exit 1
fi

echo "✅ Server build successful!"
cd ..

echo "🔧 Generating TypeScript bindings..."
# Define WASM path pro správnou lokaci po buildu
WASM_PATH="server/bin/Debug/net8.0/wasi-wasm/AppBundle/StdbModule.wasm"

# Check if the WASM file exists
if [ ! -f "$WASM_PATH" ]; then
  echo "❌ WASM file not found at $WASM_PATH!"
  echo "Searching for WASM files..."
  find server -name "*.wasm" -type f
  exit 1
fi

# Generate bindings using spacetime CLI
spacetime generate -l typescript -b "$WASM_PATH" -o src/module_bindings/generated

echo "✅ TypeScript bindings generated!"
echo "📁 Generated files:"
ls -la src/module_bindings/generated