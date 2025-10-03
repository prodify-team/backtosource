const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to bot configuration file
const CONFIG_PATH = path.join(__dirname, '../../../config/bot-instructions.js');
const CONFIG_BACKUP_PATH = path.join(__dirname, '../../../config/bot-instructions-backup.js');

// Get current bot configuration
router.get('/', async (req, res) => {
  try {
    // Clear require cache to get fresh config
    delete require.cache[require.resolve('../../../config/bot-instructions')];
    const config = require('../../../config/bot-instructions');
    
    res.json({
      success: true,
      config: config,
      lastModified: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error loading bot configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load configuration',
      message: error.message
    });
  }
});

// Update bot configuration
router.post('/', async (req, res) => {
  try {
    const newConfig = req.body;
    
    // Validate configuration structure
    const validationResult = validateConfiguration(newConfig);
    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid configuration',
        details: validationResult.errors
      });
    }

    // Create backup of current configuration
    try {
      const currentConfig = await fs.readFile(CONFIG_PATH, 'utf8');
      await fs.writeFile(CONFIG_BACKUP_PATH, currentConfig);
      console.log('✅ Configuration backup created');
    } catch (backupError) {
      console.warn('⚠️ Could not create backup:', backupError.message);
    }

    // Generate new configuration file content
    const configContent = generateConfigFileContent(newConfig);
    
    // Write new configuration
    await fs.writeFile(CONFIG_PATH, configContent);
    
    // Clear require cache to reload new config
    delete require.cache[require.resolve('../../../config/bot-instructions')];
    
    console.log('✅ Bot configuration updated successfully');
    
    res.json({
      success: true,
      message: 'Configuration updated successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error updating bot configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update configuration',
      message: error.message
    });
  }
});

// Reset configuration to defaults
router.post('/reset', async (req, res) => {
  try {
    const defaultConfig = getDefaultConfiguration();
    const configContent = generateConfigFileContent(defaultConfig);
    
    await fs.writeFile(CONFIG_PATH, configContent);
    delete require.cache[require.resolve('../../../config/bot-instructions')];
    
    res.json({
      success: true,
      message: 'Configuration reset to defaults',
      config: defaultConfig
    });
  } catch (error) {
    console.error('Error resetting configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset configuration',
      message: error.message
    });
  }
});

// Restore from backup
router.post('/restore', async (req, res) => {
  try {
    const backupContent = await fs.readFile(CONFIG_BACKUP_PATH, 'utf8');
    await fs.writeFile(CONFIG_PATH, backupContent);
    delete require.cache[require.resolve('../../../config/bot-instructions')];
    
    res.json({
      success: true,
      message: 'Configuration restored from backup'
    });
  } catch (error) {
    console.error('Error restoring configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore configuration',
      message: error.message
    });
  }
});

// Test bot with current configuration
router.post('/test', async (req, res) => {
  try {
    const { message, userRole = 'chef', preferredLanguage = 'english' } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required for testing'
      });
    }

    // Import AI service and test
    const aiService = require('../services/aiService');
    
    const userContext = {
      role: userRole,
      preferredLanguage: preferredLanguage,
      restaurantName: 'Back to Source'
    };

    const response = await aiService.processMessage(message, userContext);
    
    res.json({
      success: true,
      testResult: {
        input: {
          message: message,
          userRole: userRole,
          preferredLanguage: preferredLanguage
        },
        output: {
          response: response,
          timestamp: new Date().toISOString()
        }
      }
    });
    
  } catch (error) {
    console.error('Error testing bot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test bot',
      message: error.message
    });
  }
});

// Validate configuration structure
function validateConfiguration(config) {
  const errors = [];
  
  // Check required sections
  if (!config.identity) errors.push('Missing identity section');
  if (!config.systemInstructions) errors.push('Missing systemInstructions section');
  if (!config.roleInstructions) errors.push('Missing roleInstructions section');
  
  // Check identity fields
  if (config.identity) {
    if (!config.identity.name) errors.push('Missing bot name');
    if (!config.identity.role) errors.push('Missing bot role');
  }
  
  // Check system instructions
  if (config.systemInstructions) {
    if (!config.systemInstructions.primary) errors.push('Missing primary instruction');
    if (!Array.isArray(config.systemInstructions.core_rules)) {
      errors.push('Core rules must be an array');
    }
  }
  
  // Check role instructions
  if (config.roleInstructions) {
    const requiredRoles = ['chef', 'waiter', 'delivery-boy', 'supervisor'];
    requiredRoles.forEach(role => {
      if (!config.roleInstructions[role]) {
        errors.push(`Missing role instructions for ${role}`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// Generate configuration file content
function generateConfigFileContent(config) {
  return `// Bot Instructions Configuration for Back to Source Restaurant
// This file defines the AI assistant's behavior, personality, and response guidelines
// Last updated: ${new Date().toISOString()}

module.exports = ${JSON.stringify(config, null, 2)};`;
}

// Get default configuration
function getDefaultConfiguration() {
  return {
    identity: {
      name: "Back to Source AI Assistant",
      role: "Restaurant Staff Helper",
      personality: "Professional, helpful, knowledgeable about Indian cuisine",
      language_preference: "Auto-detect (Hindi/English)"
    },
    systemInstructions: {
      primary: "You are an AI assistant for \"Back to Source\" restaurant chain specializing in authentic Indian slow cooking.",
      core_rules: [
        "Use ONLY information from the provided knowledge base",
        "If information is not available, clearly state this",
        "Never use general knowledge outside the knowledge base",
        "Always maintain professional and helpful tone",
        "Respond in the same language as the user's query",
        "Use emojis appropriately to make responses engaging"
      ],
      knowledge_policy: "Strict - Only use provided documents and knowledge base content"
    },
    roleInstructions: {
      chef: {
        focus: ["cooking techniques", "recipes", "kitchen management", "food safety"],
        tone: "Expert culinary guidance"
      },
      waiter: {
        focus: ["customer service", "menu knowledge", "order taking", "table management"],
        tone: "Customer service oriented"
      },
      "delivery-boy": {
        focus: ["delivery protocols", "customer interaction", "safety guidelines"],
        tone: "Safety and efficiency focused"
      },
      supervisor: {
        focus: ["team coordination", "quality control", "training guidance"],
        tone: "Leadership and management focused"
      }
    },
    formatting: {
      use_emojis: true,
      structure: {
        use_bullet_points: true,
        use_headings: true,
        max_response_length: 500
      }
    },
    behaviorModifiers: {
      strictness_level: "high",
      formality_level: "professional",
      special_instructions: [
        "Always emphasize food safety when discussing kitchen procedures",
        "Promote team collaboration and learning",
        "Encourage following SOPs and company policies"
      ]
    }
  };
}

module.exports = router;