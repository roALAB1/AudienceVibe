#!/bin/bash
# Pre-build validation script
# Checks all required files and dependencies before building

set -e

echo "🔍 Pre-build Validation Starting..."
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Function to check file exists
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} Found: $1"
  else
    echo -e "${RED}✗${NC} Missing: $1"
    ERRORS=$((ERRORS + 1))
  fi
}

# Function to check directory exists
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} Found: $1/"
    return 0
  else
    echo -e "${RED}✗${NC} Missing: $1/"
    ERRORS=$((ERRORS + 1))
    return 1
  fi
}

# Function to check command exists
check_command() {
  if command -v "$1" &> /dev/null; then
    VERSION=$($1 --version 2>&1 | head -1)
    echo -e "${GREEN}✓${NC} Found: $1 ($VERSION)"
  else
    echo -e "${RED}✗${NC} Missing: $1"
    ERRORS=$((ERRORS + 1))
  fi
}

echo "📦 Checking Build Tools..."
check_command node
check_command pnpm

# Check pnpm-installed binaries
if command -v pnpm &> /dev/null; then
  if pnpm vite --version &> /dev/null; then
    VITE_VERSION=$(pnpm vite --version 2>&1 | head -1)
    echo -e "${GREEN}✓${NC} Found: vite ($VITE_VERSION)"
  else
    echo -e "${RED}✗${NC} Missing: vite (via pnpm)"
    ERRORS=$((ERRORS + 1))
  fi
  
  if pnpm esbuild --version &> /dev/null; then
    ESBUILD_VERSION=$(pnpm esbuild --version 2>&1)
    echo -e "${GREEN}✓${NC} Found: esbuild ($ESBUILD_VERSION)"
  else
    echo -e "${RED}✗${NC} Missing: esbuild (via pnpm)"
    ERRORS=$((ERRORS + 1))
  fi
fi
echo ""

echo "📄 Checking Configuration Files..."
check_file "package.json"
check_file "pnpm-lock.yaml"
check_file "vite.config.ts"
check_file "tsconfig.json"
check_file "tsconfig.node.json"
check_file "drizzle.config.ts"
check_file "components.json"
echo ""

echo "📁 Checking Source Directories..."
check_dir "client"
check_dir "client/src"
check_dir "server"
check_dir "shared"
check_dir "drizzle"
check_dir "node_modules"
echo ""

echo "🔧 Checking Critical Source Files..."
check_file "client/src/App.tsx"
check_file "client/src/main.tsx"
check_file "server/_core/index.ts"
check_file "drizzle/schema.ts"
echo ""

echo "📦 Checking node_modules..."
if check_dir "node_modules"; then
  # Check critical dependencies
  if [ -d "node_modules/vite" ]; then
    echo -e "${GREEN}✓${NC} vite installed"
  else
    echo -e "${RED}✗${NC} vite not installed"
    ERRORS=$((ERRORS + 1))
  fi
  
  if [ -d "node_modules/esbuild" ]; then
    echo -e "${GREEN}✓${NC} esbuild installed"
  else
    echo -e "${RED}✗${NC} esbuild not installed"
    ERRORS=$((ERRORS + 1))
  fi
  
  if [ -d "node_modules/react" ]; then
    echo -e "${GREEN}✓${NC} react installed"
  else
    echo -e "${RED}✗${NC} react not installed"
    ERRORS=$((ERRORS + 1))
  fi
fi
echo ""

# Check if dist directory exists and warn
if [ -d "dist" ]; then
  echo -e "${YELLOW}⚠${NC}  dist/ directory exists (will be overwritten)"
else
  echo -e "${GREEN}✓${NC} dist/ directory doesn't exist (will be created)"
fi
echo ""

# Summary
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Ready to build.${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}❌ Found $ERRORS error(s). Cannot proceed with build.${NC}"
  echo ""
  echo "Suggested fixes:"
  echo "1. Run: pnpm install"
  echo "2. Ensure all source files are present"
  echo "3. Check that you're in the project root directory"
  echo ""
  exit 1
fi
