# How to Run the Task Tracker Application

This guide will help you run the complete Task Tracker application with both frontend and backend.

## Quick Start (3 Steps)

### 1. Start MongoDB
```bash
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=task-tracker mongo:7.0
```

### 2. Start Backend
```bash
cd backend
npm install  # First time only
npm start
```

### 3. Start Frontend
```bash
cd frontend
python3 -m http.server 3000
```

Then open http://localhost:3000 in your browser!

---

## Using the Start Script (Easiest)

We provide a convenient script that starts everything:

```bash
./start.sh
```

This will:
- ✅ Check and start MongoDB if needed
- ✅ Install backend dependencies (if needed)
- ✅ Start the backend server
- ✅ Start the frontend server
- ✅ Show you all the URLs and process IDs

---

## Manual Setup (Step by Step)

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Docker** - [Download](https://www.docker.com/get-started)
- **Python** (usually pre-installed on macOS/Linux)

### Step 1: MongoDB Setup

**Option A: Using Docker (Recommended)**
```bash
# Start MongoDB
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=task-tracker \
  mongo:7.0

# Verify it's running
docker ps | grep mongodb
```

**Option B: Local MongoDB**
See `MONGODB_SETUP.md` for detailed installation instructions.

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Create .env file (first time only)
cp .env.example .env

# Start the backend server
npm start
```

You should see:
```
✓ MongoDB Connected: localhost
Server is running on port 5000
```

Keep this terminal open!

### Step 3: Frontend Setup

Open a **new terminal** and run:

```bash
# Navigate to frontend directory
cd frontend

# Start frontend server using Python
python3 -m http.server 3000

# Alternative (older Python):
# python -m SimpleHTTPServer 3000
```

Or simply open `frontend/index.html` directly in your browser.

### Step 4: Access the Application

Open your browser and go to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application UI |
| **Backend API** | http://localhost:5000 | REST API server |
| **MongoDB** | localhost:27017 | Database |

---

## Using the Application

### 1. Register a New Account
- Click on the "Register" tab
- Enter your name, email, and password (min 6 characters)
- Click "Register"

### 2. Login
- Enter your email and password
- Click "Login"
- You'll be redirected to the main application

### 3. Create Tasks
- Fill in the "Add New Task" form:
  - **Title:** Task name
  - **Description:** Task details
  - **Priority:** Low, Medium, or High
  - **Status:** To Do, In Progress, or Completed
  - **Due Date:** Optional
- Click "Add Task"

### 4. Manage Tasks
- **Filter:** Click filter buttons to view tasks by status
- **Update Status:** Click "Mark as..." buttons to update task status
- **Delete:** Click "Delete" button to remove a task

### 5. Logout
- Click the "Logout" button in the header when done

---

## Stopping the Application

### Stop Backend
```bash
# Find the process
ps aux | grep "node server.js"

# Kill the process (replace PID with actual process ID)
kill <PID>
```

### Stop Frontend
```bash
# Find the process
ps aux | grep "http.server"

# Kill the process
kill <PID>

# Or press Ctrl+C in the terminal where it's running
```

### Stop MongoDB
```bash
docker stop mongodb
```

---

## Troubleshooting

### Backend won't start

**Problem:** "Cannot find module 'express'"
```bash
cd backend
npm install
```

**Problem:** "MongoDB connection error"
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Start MongoDB if not running
docker start mongodb

# Or create new container
docker run -d --name mongodb -p 27017:27017 mongo:7.0
```

**Problem:** "Port 5000 is already in use"
```bash
# Find what's using the port
lsof -i :5000

# Kill the process or change PORT in backend/.env
```

### Frontend won't connect to backend

**Problem:** "Network error" in browser console

**Solution:**
1. Make sure backend is running (http://localhost:5000)
2. Check browser console for CORS errors
3. Verify API_URL in `frontend/app.js` is correct:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```

### Can't create tasks

**Problem:** "Not authorized" error

**Solution:**
1. Logout and login again
2. Clear browser localStorage: 
   - Open browser console
   - Run: `localStorage.clear()`
3. Refresh the page and login

### MongoDB data is gone

**Problem:** Lost all tasks after restarting

**Solution:**
- If using Docker, data is stored in a volume
- To persist data, use a named volume:
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7.0
```

---

## Development Tips

### Backend Development
```bash
cd backend

# Watch mode (auto-restart on changes)
# Install nodemon first:
npm install -g nodemon

# Run with nodemon
nodemon server.js
```

### Frontend Development
- Simply save your changes and refresh the browser
- The frontend is static HTML/CSS/JS, no build needed

### API Testing
```bash
# Test backend API
cd backend
npm test

# Or use curl
curl http://localhost:5000/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'
```

---

## Alternative Frontend Servers

If Python is not available, you can use:

### Using Node.js http-server
```bash
npm install -g http-server
cd frontend
http-server -p 3000
```

### Using PHP
```bash
cd frontend
php -S localhost:3000
```

### Using VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `frontend/index.html`
3. Select "Open with Live Server"

---

## Production Deployment

For production deployment, see `DEPLOYMENT.md` (coming soon).

Quick tips:
- Use MongoDB Atlas for database
- Deploy backend to Heroku, Railway, or AWS
- Deploy frontend to Netlify, Vercel, or GitHub Pages
- Use environment variables for configuration
- Enable HTTPS
- Add rate limiting and security headers

---

## Project Structure

```
task-tracker/
├── backend/              # Node.js/Express backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middlewares/     # Auth & error handling
│   ├── server.js        # Express app entry point
│   └── .env             # Environment variables
├── frontend/            # HTML/CSS/JS frontend
│   ├── index.html       # Main HTML file
│   ├── styles.css       # Styling
│   └── app.js           # JavaScript logic
├── start.sh             # Convenient start script
└── RUN_APPLICATION.md   # This file
```

---

## Need Help?

- **Backend API Docs:** See `backend/README.md`
- **MongoDB Setup:** See `MONGODB_SETUP.md`
- **Quick Start:** See `QUICKSTART.md`
- **Getting Started:** See `GETTING_STARTED.md`

---

## Summary

✅ **To run the application:**
1. Start MongoDB: `docker run -d --name mongodb -p 27017:27017 mongo:7.0`
2. Start backend: `cd backend && npm start`
3. Start frontend: `cd frontend && python3 -m http.server 3000`
4. Open: http://localhost:3000

Or simply use: `./start.sh`

**Enjoy using Task Tracker! 🚀**
