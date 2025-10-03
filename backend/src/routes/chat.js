const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Chat with AI assistant
router.post('/message', async (req, res) => {
  try {
    const { message, userId, userRole, userName, preferredLanguage } = req.body;
    
    console.log(`📨 Received message: "${message}" from ${userName || 'User'} (${userRole || 'unknown role'})`);
    
    // For demo mode, use provided user context or defaults
    const userContext = {
      role: userRole || 'trainee',
      name: userName || 'Ji',
      restaurantName: 'Back to Source',
      preferredLanguage: preferredLanguage || 'hinglish'
    };

    const aiResponse = await aiService.processMessage(message, userContext);
    
    console.log(`✅ Generated response (${aiResponse.length} chars)`);
    
    res.json({
      response: aiResponse,
      timestamp: new Date(),
      userRole: userRole,
      userName: userName
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Unable to process your request. Please try again.'
    });
  }
});

// Get suggested tasks based on role (demo mode)
router.get('/suggestions/:role', async (req, res) => {
  try {
    const role = req.params.role;
    const demoRestaurantData = {
      sops: [
        { title: 'Food Safety', category: 'safety' },
        { title: 'Customer Service', category: 'service' }
      ]
    };

    const suggestions = await aiService.generateTaskSuggestions(role, demoRestaurantData);
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;