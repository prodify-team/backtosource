const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Back to Source API is working!', 
    timestamp: new Date(),
    endpoints: {
      chat: 'POST /api/chat/message',
      auth: 'POST /api/auth/login'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/training', require('./routes/training'));
app.use('/api/knowledge', require('./routes/knowledge'));

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_restaurant', (restaurantId) => {
    socket.join(restaurantId);
  });
  
  socket.on('send_message', (data) => {
    io.to(data.restaurantId).emit('receive_message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB connection (optional for demo)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.log('MongoDB connection error:', err.message);
    console.log('Running in demo mode without database');
  });
} else {
  console.log('No MongoDB URI provided - running in demo mode');
}

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`🚀 Back to Source API running on port ${PORT}`);
  console.log(`📱 Frontend should connect to http://localhost:${PORT}`);
});