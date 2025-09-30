const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Chat with AI assistant
router.post('/message', async (req, res) => {
  try {
    const { message, userId, userRole, preferredLanguage } = req.body;
    
    // For demo mode, use provided user context or defaults
    const userContext = {
      role: userRole || 'chef',
      restaurantName: 'Back to Source',
      preferredLanguage: preferredLanguage || 'hindi'
    };

    const aiResponse = await aiService.processMessage(message, userContext);
    
    res.json({
      response: aiResponse,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Server error' });
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