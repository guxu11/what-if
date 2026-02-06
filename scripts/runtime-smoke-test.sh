#!/bin/bash

# Runtime smoke test to catch runtime error patterns
# This script checks that:
# 1. main.jsx exists and has content
# 2. main.jsx imports and wraps App with TranslationProvider
# 3. The build succeeds
# 4. The preview server starts without errors
# 5. No runtime errors in the built application

set -e  # Exit on any error

echo "🔍 Running runtime smoke test..."

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

# CRITICAL: Check that main.jsx imports TranslationProvider
if ! grep -q "TranslationProvider" "src/main.jsx"; then
  echo "❌ FAIL: src/main.jsx missing 'TranslationProvider' import"
  echo "   This would cause 'useTranslation must be used within a TranslationProvider' error"
  exit 1
fi

echo "✅ TranslationProvider is imported in main.jsx"

# CRITICAL: Check that main.jsx wraps App with TranslationProvider
if ! grep -q "<TranslationProvider>" "src/main.jsx"; then
  echo "❌ FAIL: src/main.jsx missing '<TranslationProvider>' wrapper around App"
  echo "   This would cause 'useTranslation must be used within a TranslationProvider' error"
  exit 1
fi

echo "✅ App is wrapped with TranslationProvider"

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

# Check that useTranslation.jsx throws the expected error
if ! grep -q "useTranslation must be used within a TranslationProvider" "src/i18n/useTranslation.jsx"; then
  echo "❌ FAIL: src/i18n/useTranslation.jsx missing expected error message"
  exit 1
fi

echo "✅ useTranslation.jsx has proper error handling"

# Try to build the project
echo "🏗️  Running production build..."
if ! npm run build > /dev/null 2>&1; then
  echo "❌ FAIL: Build failed"
  exit 1
fi

echo "✅ Build succeeded"

# Check that the built HTML includes the bundled script
if ! grep -q "type=\"module\"" "dist/index.html"; then
  echo "❌ FAIL: Built HTML missing module script"
  exit 1
fi

echo "✅ Built HTML looks correct"

# Start preview server and check for errors
echo "🚀 Starting preview server to check for runtime errors..."
PREVIEW_PID=""

# Start preview server in background
npm run preview > /tmp/preview-output.log 2>&1 &
PREVIEW_PID=$!

# Wait for server to start
sleep 3

# Check if server is still running
if ! kill -0 $PREVIEW_PID 2>/dev/null; then
  echo "❌ FAIL: Preview server failed to start"
  cat /tmp/preview-output.log
  exit 1
fi

echo "✅ Preview server started successfully"

# Check preview output for errors
if grep -i "error" /tmp/preview-output.log | grep -v "EADDR"; then
  echo "❌ FAIL: Preview server logged errors"
  cat /tmp/preview-output.log
  kill $PREVIEW_PID 2>/dev/null || true
  exit 1
fi

echo "✅ No errors in preview server logs"

# Kill the preview server
kill $PREVIEW_PID 2>/dev/null || true
wait $PREVIEW_PID 2>/dev/null || true

echo ""
echo "🎉 All runtime smoke tests passed!"
echo "   ✓ TranslationProvider wraps App"
echo "   ✓ Build succeeds"
echo "   ✓ Preview server starts without errors"
exit 0
