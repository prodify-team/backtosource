#!/bin/bash

echo "🚀 Starting Back to Source Chatbot..."

# Kill any existing processes on our ports
echo "Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start backend
echo "Starting backend on port 3001..."
cd backend
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend on port 3000..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ Both services starting..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
wait