#!/bin/bash

# Script to run all tests for SpacetimeSheets

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to run a command and check its exit code
run_command() {
  echo -e "${YELLOW}Running: $1${NC}"
  eval $1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Command completed successfully${NC}"
    return 0
  else
    echo -e "${RED}✗ Command failed${NC}"
    return 1
  fi
}

# Create test results directory if it doesn't exist
mkdir -p test-results

echo -e "${YELLOW}===========================================${NC}"
echo -e "${YELLOW}     🧪 SpacetimeSheets Test Runner 🧪     ${NC}"
echo -e "${YELLOW}===========================================${NC}"

# 1. Run SpacetimeDB server-side tests
echo -e "\n${YELLOW}📊 Running server-side tests...${NC}"
cd server
if ! dotnet run --project Tests.csproj 2>&1 | tee ../test-results/server-tests.log; then
  echo -e "${RED}✗ Server tests failed - see test-results/server-tests.log for details${NC}"
  cd ..
else
  echo -e "${GREEN}✓ Server tests completed${NC}"
  cd ..
fi

# 2. Run TypeScript type checking
echo -e "\n${YELLOW}📝 Running TypeScript type checking...${NC}"
if ! run_command "npm run typecheck" 2>&1 | tee test-results/typecheck.log; then
  echo -e "${RED}✗ TypeScript type checking failed - see test-results/typecheck.log for details${NC}"
fi

# 3. Run ESLint
echo -e "\n${YELLOW}🔍 Running ESLint...${NC}"
if ! run_command "npm run lint" 2>&1 | tee test-results/eslint.log; then
  echo -e "${RED}✗ ESLint check failed - see test-results/eslint.log for details${NC}"
fi

# 4. Run Playwright E2E tests if --e2e flag is provided
if [[ "$*" == *"--e2e"* ]]; then
  echo -e "\n${YELLOW}🎭 Running Playwright E2E tests...${NC}"
  
  # Check if SpacetimeDB is running, start it if not
  if ! nc -z localhost 3000 2>/dev/null; then
    echo -e "${YELLOW}Starting SpacetimeDB server for E2E tests...${NC}"
    spacetime start &
    SPACETIME_PID=$!
    sleep 5
    
    # Deploy module
    echo -e "${YELLOW}Deploying SpacetimeDB module for E2E tests...${NC}"
    cd server
    spacetime build --debug
    cd ..
    spacetime publish -s "spacetime-sheets-local" "spacetime-sheets-test"
    
    # Set a flag to indicate we started SpacetimeDB
    STARTED_SPACETIME=true
  fi
  
  # Run Playwright tests
  if ! run_command "npx playwright test" 2>&1 | tee test-results/e2e-tests.log; then
    echo -e "${RED}✗ E2E tests failed - see test-results/e2e-tests.log for details${NC}"
  fi
  
  # Stop SpacetimeDB if we started it
  if [ "$STARTED_SPACETIME" = true ]; then
    echo -e "${YELLOW}Stopping SpacetimeDB server...${NC}"
    kill $SPACETIME_PID
  fi
fi

echo -e "\n${YELLOW}===========================================${NC}"
echo -e "${GREEN}🏁 All tests completed${NC}"
echo -e "${YELLOW}===========================================${NC}"

# Make the script executable
chmod +x scripts/run-tests.sh
