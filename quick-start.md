# Quick Start Guide

## The Issue
Port conflicts and missing dependencies were causing startup problems.

## Fixed Solution

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm install
node src/server.js
```
Should show: `🚀 Back to Source API running on port 3001`

### 2. Start Frontend (Terminal 2)  
```bash
cd frontend
npm start
```
Should open: `http://localhost:3000`

### 3. Test the Chatbot
1. Enter your name (e.g., "Raj")
2. Select role (e.g., "Chef")  
3. Click "शुरू करें" or "Start"
4. Try asking: "दाल मखनी कैसे बनाएं?"

## What's Working
- ✅ Hindi/English language toggle
- ✅ OpenAI API integration with your key
- ✅ Restaurant-specific AI responses
- ✅ Voice synthesis for Hindi
- ✅ Role-based context (chef, waiter, etc.)

## If Still Having Issues
The chatbot will work even if backend fails - it shows helpful error messages and lets you test the UI.