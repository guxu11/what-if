#!/bin/bash

# Smoke test script to catch entry point issues
# This script checks that:
# 1. main.jsx exists and has content
# 2. The build succeeds

set -e  # Exit on any error

echo "🔍 Running smoke test..."

# Check main.jsx exists and is not empty
if [ ! -s "src/main.jsx" ]; then
  echo "❌ FAIL: src/main.jsx does not exist or is empty"
  exit 1
fi

# Check that main.jsx contains essential keywords
if ! grep -q "createRoot" "src/main.jsx"; then
  echo "❌ FAIL: src/main.jsx missing 'createRoot'"
  exit 1
fi

if ! grep -q "App" "src/main.jsx"; then
  echo "❌ FAIL: src/main.jsx missing 'App' import"
  exit 1
fi

echo "✅ src/main.jsx looks good"

# Check that useTranslation.jsx exists (not .js)
if [ -f "src/i18n/useTranslation.js" ]; then
  echo "❌ FAIL: src/i18n/useTranslation.js should be .jsx (contains JSX)"
  exit 1
fi

if [ ! -f "src/i18n/useTranslation.jsx" ]; then
  echo "❌ FAIL: src/i18n/useTranslation.jsx is missing"
  exit 1
fi

echo "✅ i18n/useTranslation.jsx exists (not .js)"

# Try to build the project
echo "🏗️  Running production build..."
if ! npm run build > /dev/null 2>&1; then
  echo "❌ FAIL: Build failed"
  exit 1
fi

echo "✅ Build succeeded"

echo ""
echo "🎉 All smoke tests passed!"
exit 0
