#!/bin/bash
set -e  # Exit on error
set -x  # Print commands

echo "=== Build Script Started ==="
echo "Node version: $(node --version)"
echo "pnpm version: $(pnpm --version)"
echo "Working directory: $(pwd)"
echo "Files present:"
ls -la

echo ""
echo "=== Step 1: Building frontend with Vite ==="
pnpm vite build || {
  echo "ERROR: Vite build failed!"
  exit 1
}

echo ""
echo "=== Step 2: Building server with esbuild ==="
pnpm esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist || {
  echo "ERROR: esbuild failed!"
  exit 1
}

echo ""
echo "=== Step 3: Verifying build output ==="
if [ ! -f "dist/public/index.html" ]; then
  echo "ERROR: dist/public/index.html not found!"
  exit 1
fi

if [ ! -f "dist/index.js" ]; then
  echo "ERROR: dist/index.js not found!"
  exit 1
fi

echo ""
echo "=== Build completed successfully ==="
echo "Output files:"
ls -lh dist/
ls -lh dist/public/ | head -10

exit 0
