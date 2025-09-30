const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Serve static files
app.use(express.static('.'));

// Serve the chatbot HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple-chatbot.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Chatbot running at: http://localhost:${PORT}`);
  console.log(`📱 Direct link: http://localhost:${PORT}/simple-chatbot.html`);
  console.log(`🔧 Make sure backend is running on http://localhost:3001`);
});