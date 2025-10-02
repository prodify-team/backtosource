const express = require('express');
const router = express.Router();

// In-memory user storage for demo (in production, use database)
const users = new Map();
const GoogleSheetsDB = require('../config/googleSheets');

// Initialize Google Sheets on startup
GoogleSheetsDB.initialize().catch(console.error);

// Check if user exists
router.post('/check-user', async (req, res) => {
  try {
    const { phone } = req.body;
    
    // Check Google Sheets first, then fallback to local
    const sheetsUser = await GoogleSheetsDB.findUserByPhone(phone);
    const localExists = users.has(phone);
    const exists = sheetsUser || localExists;
    
    res.json({
      success: true,
      exists: !!exists,
      message: exists ? 'User found' : 'New user'
    });
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { phone, name, role, location } = req.body;
    
    if (!phone || !name || !role || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const userData = {
      phone,
      name: name.trim(),
      role,
      location,
      preferredLanguage: 'hindi'
    };

    // Try to save to Google Sheets first
    const sheetsUser = await GoogleSheetsDB.createUser(userData);
    
    // Also save locally as backup
    const user = {
      _id: sheetsUser?.id || Date.now().toString(),
      ...userData,
      isActive: true,
      joinedAt: new Date(),
      lastSeen: new Date()
    };

    users.set(phone, user);

    res.json({
      success: true,
      user,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login existing user
router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const user = users.get(phone);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update last seen
    user.lastSeen = new Date();
    users.set(phone, user);

    res.json({
      success: true,
      user,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (for admin)
router.get('/users', async (req, res) => {
  try {
    const allUsers = Array.from(users.values());
    
    res.json({
      success: true,
      users: allUsers,
      total: allUsers.length,
      byLocation: allUsers.reduce((acc, user) => {
        acc[user.location] = (acc[user.location] || 0) + 1;
        return acc;
      }, {}),
      byRole: allUsers.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;