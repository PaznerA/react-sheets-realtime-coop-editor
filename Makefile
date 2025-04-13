# SpacetimeSheets Makefile
# Main makefile for quick development environment setup

.PHONY: all local cloud deploy stop check-deps test help log

# Default target - show help
help:
	@echo "🚀 SpacetimeSheets Makefile 🚀"
	@echo ""
	@echo "Available targets:"
	@echo "  make all     - Run the full stack including tests"
	@echo "  make local   - Quick start for local development (skips tests)"
	@echo "  make cloud   - Prepare and test in MainCloud environment"
	@echo "  make deploy  - Prepare for deployment (GitHub Actions)"
	@echo "  make stop    - Stop all running processes"
	@echo "  make test    - Run tests"
	@echo "  make log     - Show live logs from both servers"
	@echo "  make help    - Show this help"

# Check if all necessary tools are installed
check-deps:
	@echo "🔍 Checking required tools..."
	@command -v spacetime >/dev/null 2>&1 || { echo "❌ Missing 'spacetime' tool. Install it using https://spacetimedb.com/install"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "❌ Missing 'npm' tool. Install Node.js."; exit 1; }
	@echo "✅ All required tools are available."

# Main development target - runs everything including tests
all: check-deps
	@echo "🚀 Starting complete development stack..."
	@chmod +x ./scripts/run-all.sh
	@./scripts/run-all.sh

# Faster startup for local development (skips tests)
local: check-deps
	@echo "🚀 Starting local development stack (without tests)..."
	@chmod +x ./scripts/run-all.sh
	@./scripts/run-all.sh --no-test

# Testing in MainCloud environment
cloud: check-deps
	@echo "🚀 Preparing for testing in MainCloud..."
	@echo "⚠️ This feature is not yet implemented."
	@echo "👷 Add code for MainCloud deployment here."
	@exit 1

# Preparation for GitHub Actions deployment
deploy: check-deps
	@echo "📦 Preparing for deployment..."
	@echo "⚠️ This feature is not yet implemented."
	@echo "👷 Add code for deployment here."
	@exit 1

# Run tests separately
test:
	@echo "🧪 Running tests..."
	@npm run test:e2e

# Stop all running processes
stop:
	@echo "🛑 Stopping all running processes..."
	@chmod +x ./scripts/stop-all.sh
	@./scripts/stop-all.sh

# View live logs from both servers
log:
	@echo "📋 Showing live logs from both servers. Press Ctrl+C to stop."
	@echo "----------------------------------------"
	@if [ ! -f logs/spacetime_server.log ] || [ ! -f logs/frontend.log ]; then \
		echo "❌ Log files not found. Make sure servers are running first."; \
		exit 1; \
	fi
	@tail -f logs/spacetime_server.log logs/frontend.log
