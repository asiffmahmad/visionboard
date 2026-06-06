#!/usr/bin/env bash
set -e

# ---------------------------------------------------
# Vision Board - Local Run Script (Without Docker)
# ---------------------------------------------------
# This script stops any local servers running on app ports,
# builds the backend (Maven) and frontend (NPM),
# starts both in the background, and opens the frontend.
# ---------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Stop existing local servers running on ports 8080 and 5173
echo "🛑 Checking for and stopping any existing services running on ports 8080 and 5173..."
BACKEND_PID=$(lsof -t -i:8080 || true)
if [ -n "$BACKEND_PID" ]; then
  echo "Stopping process running on port 8080 (PID: $BACKEND_PID)..."
  kill -9 $BACKEND_PID || true
fi

FRONTEND_PID=$(lsof -t -i:5173 || true)
if [ -n "$FRONTEND_PID" ]; then
  echo "Stopping process running on port 5173 (PID: $FRONTEND_PID)..."
  kill -9 $FRONTEND_PID || true
fi

# 2. Build and Start Backend
echo "🧹 Cleaning existing database files..."
rm -rf "$SCRIPT_DIR/backend/data"

echo "☕ Building backend via Maven..."
cd "$SCRIPT_DIR/backend"
mvn clean package -DskipTests

echo "🚀 Starting backend in background (logging to backend.log)..."
java -jar target/todo-backend-1.0.0.jar > "$SCRIPT_DIR/backend.log" 2>&1 &

# 3. Build and Start Frontend
echo "📦 Building frontend via NPM..."
cd "$SCRIPT_DIR/frontend"
npm install
npm run build

echo "⚡ Starting frontend dev server in background (logging to frontend.log)..."
npm run dev > "$SCRIPT_DIR/frontend.log" 2>&1 &

# 4. Open browser
sleep 4
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:8080/swagger-ui/index.html"

echo -e "\n========================================="
echo "🎉 Vision Board is successfully running locally!"
echo "🌐 UI Link:          ${FRONTEND_URL}"
echo "📄 Backend API Link: ${BACKEND_URL}"
echo "========================================="

if command -v open > /dev/null 2>&1; then
  echo "🌐 Opening UI in your default browser..."
  open "${FRONTEND_URL}"
else
  echo "⚠️ 'open' command not found. Please open ${FRONTEND_URL} manually."
fi
