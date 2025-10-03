// Quick local server to test your bot
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Local server working!', timestamp: new Date() });
});

// Chat endpoint
app.post('/api/chat', (req, res) => {
  const { message, userRole, userName } = req.body;
  const response = getResponse(message, userRole || 'trainee', userName || 'Ji');
  res.json({ response, timestamp: new Date() });
});

function getResponse(message, userRole, userName) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('dal makhani') || lowerMessage.includes('recipe')) {
    if (userRole === 'chef') {
      return `Namaste Chef ${userName}! 👨‍🍳\n\n🍛 **Dal Makhani - Chef Level Recipe**\n\n• **Ingredients:** काली दाल 1 cup, राजमा 1/4 cup, मक्खन 4 tbsp, क्रीम 1/2 cup\n\n• **Chef Method:**\n  - 8 hours soaking zaroori hai\n  - Pressure cook 4-5 whistles with salt\n  - Slow cook 4-6 hours on low flame\n  - Tempering: cumin, onions, tomatoes\n  - Final touch: cream और butter\n\n• **Wrong Way:** Fast cooking या microwave mein banana\n• **Right Way:** Traditional slow cooking with patience\n\n• **Chef Assignment:** Practice temperature control aur timing perfect kariye\n\n• **Daily Tip:** Authentic taste ke liye dhimi aanch pe sabr rakhiye! 🔥`;
    }
    return `Namaste ${userName}! 📚\n\n🍛 **Dal Makhani - Learning Basics**\n\n• **What is it:** Our signature dish - black lentils cooked very slowly\n• **Key Points:** Takes 6+ hours to cook properly, Made with black lentils and kidney beans\n\n• **Assignment:** 3 experienced staff se dal makhani के बारे में और details सीखिए\n\n• **Daily Tip:** हर दिन कुछ नया सीखने की कोशिश करिए! 📖`;
  }
  
  if (lowerMessage.includes('hygiene') || lowerMessage.includes('सफाई')) {
    return `Namaste ${userName}! 🧼\n\n🧼 **Hygiene Standards**\n\n• **Hand Washing:** 20 seconds with soap, before every task\n• **Clean Uniform:** Daily fresh clothes mandatory\n• **Food Safety:** Don't touch food directly, use gloves/tools\n\n• **Wrong Way:** Hygiene rules ko ignore karna\n• **Right Way:** Every rule ko seriously follow karna\n\n• **Assignment:** Hygiene checklist banayiye aur daily follow kariye\n\n• **Daily Tip:** Good habits शुरू से ही बनाइए! ✨`;
  }
  
  return `Namaste ${userName}! 🙏\n\nMain aapki help kar sakta hun:\n\n• **"dal makhani recipe"** - Cooking guidance\n• **"hygiene rules"** - Safety guidelines\n• **"training"** - Learning modules\n\nKya specific help chahiye?\n\n**Daily Tip:** Questions puchna achhi baat hai! 💡`;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'no-otp-chatbot.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Back to Source Bot running at http://localhost:${PORT}`);
});