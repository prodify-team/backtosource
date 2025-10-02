const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files
app.use(express.static('.'));

// Route for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple-chatbot.html'));
});

// Route for admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-panel.html'));
});

// Route for enhanced chatbot
app.get('/enhanced', (req, res) => {
  res.sendFile(path.join(__dirname, 'enhanced-chatbot.html'));
});

// Catch-all for HTML files
app.get('/*.html', (req, res) => {
  const filename = req.params[0] + '.html';
  res.sendFile(path.join(__dirname, filename));
});

// API requests should NOT be handled here - they go to the backend service
// This is just a fallback in case dispatch routing fails
app.use('/api/*', (req, res) => {
  res.status(503).json({ 
    error: 'API service unavailable. Please check dispatch routing.',
    message: 'This request should be handled by the backend service.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'simple-chatbot.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});