#!/bin/bash

# Task Tracker - Start Script
# This script starts both the backend and frontend servers

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║         Task Tracker - Starting Application             ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
if docker ps | grep -q mongodb; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=task-tracker mongo:7.0
    if [ $? -eq 0 ]; then
        echo "✅ MongoDB started successfully"
        sleep 5
    else
        echo "❌ Failed to start MongoDB. Please check Docker."
        exit 1
    fi
fi

echo ""

# Start Backend
echo "🚀 Starting Backend Server..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

# Start backend in background
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   Logs: backend.log"
echo "   URL: http://localhost:5000"

cd ..
echo ""

# Start Frontend
echo "🌐 Starting Frontend Server..."
cd frontend

# Start a simple HTTP server for frontend
if command -v python3 &> /dev/null; then
    python3 -m http.server 3000 > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
    echo "   Logs: frontend.log"
    echo "   URL: http://localhost:3000"
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 3000 > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
    echo "   URL: http://localhost:3000"
else
    echo "⚠️  Python not found. Please start frontend manually."
    echo "   You can use: cd frontend && python3 -m http.server 3000"
    echo "   Or open index.html directly in your browser"
fi

cd ..
echo ""

# Summary
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║           Application Started Successfully! 🎉           ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "📝 Process IDs:"
echo "   Backend PID: $BACKEND_PID"
if [ ! -z "$FRONTEND_PID" ]; then
    echo "   Frontend PID: $FRONTEND_PID"
fi
echo ""
echo "🛑 To stop the application:"
echo "   kill $BACKEND_PID"
if [ ! -z "$FRONTEND_PID" ]; then
    echo "   kill $FRONTEND_PID"
fi
echo "   docker stop mongodb"
echo ""
echo "📚 Documentation: See README.md and RUN_APPLICATION.md"
echo ""
