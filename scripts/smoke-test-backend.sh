#!/bin/bash

# Smoke test for What-If Game backend
# This script tests the basic functionality of the backend server

set -e

echo "🚀 Running Backend Smoke Tests..."
echo ""

# Check if .env file exists
if [ ! -f "server/.env" ]; then
  echo "❌ Error: server/.env file not found"
  echo "Please copy .env.example to server/.env and add your GLM_API_KEY"
  exit 1
fi

# Source environment variables
if [ -f "server/.env" ]; then
  export $(cat server/.env | grep -v '^#' | xargs)
fi

# Check if GLM_API_KEY is set
if [ -z "$GLM_API_KEY" ]; then
  echo "❌ Error: GLM_API_KEY not set in server/.env"
  exit 1
fi

# Check if server dependencies are installed
if [ ! -d "server/node_modules" ]; then
  echo "📦 Installing server dependencies..."
  cd server
  npm install
  cd ..
fi

echo "✅ Server dependencies installed"
echo ""

# Start the server in background
echo "🔧 Starting server..."
cd server
node src/server.js &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Test health endpoint
echo "🏥 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/health || echo "failed")
if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

# Test story generation endpoint (requires valid API key)
echo "📖 Testing story generation endpoint..."
STORY_RESPONSE=$(curl -s -X POST http://localhost:3001/api/story/generate \
  -H "Content-Type: application/json" \
  -d '{"scenario":"Test scenario","language":"en"}' || echo "failed")

if [[ $STORY_RESPONSE == *"success"* ]]; then
  echo "✅ Story generation endpoint responding"
else
  echo "⚠️  Story generation endpoint may have issues (check API key)"
fi

# Test session creation endpoint
echo "💾 Testing session creation endpoint..."
SESSION_RESPONSE=$(curl -s -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"scenario":"Test scenario","language":"en"}' || echo "failed")

if [[ $SESSION_RESPONSE == *"success"* ]]; then
  echo "✅ Session creation endpoint working"
else
  echo "❌ Session creation endpoint failed"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

# Test language detection endpoint
echo "🌍 Testing language detection endpoint..."
LANG_RESPONSE=$(curl -s -X POST http://localhost:3001/api/story/detect-language \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world"}' || echo "failed")

if [[ $LANG_RESPONSE == *"language"* ]]; then
  echo "✅ Language detection endpoint working"
else
  echo "❌ Language detection endpoint failed"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

echo ""
echo "✨ All backend smoke tests completed successfully!"
echo ""

# Clean up
echo "🧹 Stopping server..."
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

echo "✅ Server stopped"
echo ""
echo "🎉 Backend is ready to use!"
echo ""
echo "Next steps:"
echo "  1. Start the server: npm run dev:server"
echo "  2. In another terminal, start the frontend: npm run dev"
echo "  3. Visit http://localhost:5173 to play the game"
echo ""
