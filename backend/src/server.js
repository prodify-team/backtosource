const express = require('express');
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
      auth: 'POST /api/auth/login',
      debug: 'POST /api/debug/search'
    }
  });
});

// Debug endpoint for knowledge base search
app.post('/api/debug/search', (req, res) => {
  try {
    const { query, userRole = 'trainee' } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`🔍 Debug search: "${query}" for role: ${userRole}`);
    
    // Import knowledge loader
    const knowledgeLoader = require('../knowledge/knowledgeLoader');
    
    // Search knowledge base
    const results = knowledgeLoader.findRelevantContent(query, userRole);
    
    res.json({
      query,
      userRole,
      resultsCount: results ? results.length : 0,
      results: results ? results.map(r => ({
        title: r.title || 'Unknown',
        source: r.source || 'Unknown Source',
        type: r.type || 'unknown',
        relevance: 'high', // We can add scoring later
        snippet: r.content ? r.content.substring(0, 200) + '...' : 'No content',
        fullContent: r.content
      })) : [],
      timestamp: new Date().toISOString(),
      knowledgeBaseStatus: 'loaded'
    });
    
  } catch (error) {
    console.error('🚨 Debug search error:', error);
    res.status(500).json({ 
      error: 'Debug search failed',
      message: error.message,
      query: req.body.query
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/training', require('./routes/training'));
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/api/bot-config', require('./routes/botConfig'));

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

// Using Google Sheets as database - no MongoDB needed
console.log('🗄️  Using Google Sheets as database backend');

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`🚀 Back to Source API running on port ${PORT}`);
  console.log(`📱 Frontend should connect to http://localhost:${PORT}`);
});