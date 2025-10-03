const OpenAI = require('openai');
const { getRoleBasedResponse } = require('../knowledge/role-based-responses');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  constructor() {
    console.log('🤖 AI Service initialized with role-based responses');
  }

  // Get simple daily tip
  getRandomDailyTip() {
    const tips = [
      "Hamesha safety first rakhiye!",
      "Team members ki help kariye",
      "Clean uniform pehna zaroori hai",
      "Customer ko smile se greet kariye",
      "Time management important hai"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  loadTrainingData() {
    const trainingPath = path.join(__dirname, '../../ai-training');
    const knowledge = {
      recipes: {},
      sops: {},
      faqs: {},
      training: {},
      locations: {}
    };

    try {
      // Load recipes
      const recipesPath = path.join(trainingPath, 'recipes');
      if (fs.existsSync(recipesPath)) {
        const recipeFiles = fs.readdirSync(recipesPath);
        recipeFiles.forEach(file => {
          if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(recipesPath, file), 'utf8');
            const recipeName = file.replace('.md', '');
            knowledge.recipes[recipeName] = content;
          }
        });
      }

      // Load SOPs
      const sopsPath = path.join(trainingPath, 'sops');
      if (fs.existsSync(sopsPath)) {
        const sopFiles = fs.readdirSync(sopsPath);
        sopFiles.forEach(file => {
          if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(sopsPath, file), 'utf8');
            const sopName = file.replace('.md', '');
            knowledge.sops[sopName] = content;
          }
        });
      }

      // Load FAQs
      const faqsPath = path.join(trainingPath, 'faqs');
      if (fs.existsSync(faqsPath)) {
        const faqFiles = fs.readdirSync(faqsPath);
        faqFiles.forEach(file => {
          if (file.endsWith('.json')) {
            const content = JSON.parse(fs.readFileSync(path.join(faqsPath, file), 'utf8'));
            const faqName = file.replace('.json', '');
            knowledge.faqs[faqName] = content;
          }
        });
      }

      // Load Training Materials
      const trainingMaterialsPath = path.join(trainingPath, 'training');
      if (fs.existsSync(trainingMaterialsPath)) {
        const trainingFiles = fs.readdirSync(trainingMaterialsPath);
        trainingFiles.forEach(file => {
          if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(trainingMaterialsPath, file), 'utf8');
            const trainingName = file.replace('.md', '');
            knowledge.training[trainingName] = content;
          }
        });
      }

      // Load Location Data
      const locationsPath = path.join(trainingPath, 'locations');
      if (fs.existsSync(locationsPath)) {
        const locationFiles = fs.readdirSync(locationsPath);
        locationFiles.forEach(file => {
          if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(locationsPath, file), 'utf8');
            const locationName = file.replace('.md', '');
            knowledge.locations[locationName] = content;
          }
        });
      }

      console.log('✅ Training data loaded successfully');
      console.log(`📚 Loaded: ${Object.keys(knowledge.recipes).length} recipes, ${Object.keys(knowledge.sops).length} SOPs, ${Object.keys(knowledge.training).length} training modules`);
      
    } catch (error) {
      console.error('❌ Error loading training data:', error.message);
    }

    return knowledge;
  }

  // Dynamic knowledge mapping based on file names
  createKnowledgeMapping() {
    const fs = require('fs');
    const path = require('path');
    
    this.knowledgeMapping = {
      // Recipe keywords extracted from file names
      recipes: {},
      // SOP keywords extracted from file names  
      sops: {},
      // Training keywords extracted from file names
      training: {},
      // Location keywords extracted from file names
      locations: {},
      // FAQ keywords extracted from file names
      faqs: {}
    };

    // Load and map all knowledge base files
    this.restaurantKnowledge = this.loadTrainingData();
    
    // Create smart keyword mappings from file names
    Object.keys(this.restaurantKnowledge.recipes).forEach(fileName => {
      const keywords = this.extractKeywords(fileName);
      this.knowledgeMapping.recipes[fileName] = keywords;
    });

    Object.keys(this.restaurantKnowledge.sops).forEach(fileName => {
      const keywords = this.extractKeywords(fileName);
      this.knowledgeMapping.sops[fileName] = keywords;
    });

    Object.keys(this.restaurantKnowledge.training).forEach(fileName => {
      const keywords = this.extractKeywords(fileName);
      this.knowledgeMapping.training[fileName] = keywords;
    });

    Object.keys(this.restaurantKnowledge.locations).forEach(fileName => {
      const keywords = this.extractKeywords(fileName);
      this.knowledgeMapping.locations[fileName] = keywords;
    });

    console.log('🧠 Knowledge mapping created:', {
      recipes: Object.keys(this.knowledgeMapping.recipes).length,
      sops: Object.keys(this.knowledgeMapping.sops).length,
      training: Object.keys(this.knowledgeMapping.training).length,
      locations: Object.keys(this.knowledgeMapping.locations).length
    });
  }

  // Extract keywords from file names for smart matching
  extractKeywords(fileName) {
    const keywords = [];
    
    // Split by hyphens and underscores
    const parts = fileName.split(/[-_]/);
    
    // Add each part as keyword
    parts.forEach(part => {
      keywords.push(part.toLowerCase());
      
      // Add common variations
      if (part === 'dal') keywords.push('दाल', 'lentil');
      if (part === 'makhani') keywords.push('मखनी', 'butter', 'creamy');
      if (part === 'kitchen') keywords.push('रसोई', 'cooking');
      if (part === 'hygiene') keywords.push('सफाई', 'cleanliness', 'safety');
      if (part === 'waiter') keywords.push('वेटर', 'service', 'customer');
      if (part === 'training') keywords.push('प्रशिक्षण', 'learning', 'guide');
    });

    // Add full filename as keyword
    keywords.push(fileName.replace(/[-_]/g, ' ').toLowerCase());
    
    return keywords;
  }

  // Smart knowledge finder based on file names and content
  findRelevantKnowledge(message, userContext) {
    if (!this.knowledgeMapping) {
      this.createKnowledgeMapping();
    }

    const lowerMessage = message.toLowerCase();
    let relevantContent = '';
    let matchedFiles = [];

    // Search in recipes
    Object.keys(this.knowledgeMapping.recipes).forEach(fileName => {
      const keywords = this.knowledgeMapping.recipes[fileName];
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        relevantContent += `\n\n📖 Recipe: ${fileName.replace(/-/g, ' ').toUpperCase()}\n${this.restaurantKnowledge.recipes[fileName]}`;
        matchedFiles.push(`Recipe: ${fileName}`);
      }
    });

    // Search in SOPs
    Object.keys(this.knowledgeMapping.sops).forEach(fileName => {
      const keywords = this.knowledgeMapping.sops[fileName];
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        relevantContent += `\n\n📋 SOP: ${fileName.replace(/-/g, ' ').toUpperCase()}\n${this.restaurantKnowledge.sops[fileName]}`;
        matchedFiles.push(`SOP: ${fileName}`);
      }
    });

    // Search in training materials
    Object.keys(this.knowledgeMapping.training).forEach(fileName => {
      const keywords = this.knowledgeMapping.training[fileName];
      if (keywords.some(keyword => lowerMessage.includes(keyword)) || 
          (userContext.role && keywords.includes(userContext.role))) {
        relevantContent += `\n\n🎓 Training: ${fileName.replace(/-/g, ' ').toUpperCase()}\n${this.restaurantKnowledge.training[fileName]}`;
        matchedFiles.push(`Training: ${fileName}`);
      }
    });

    // Search in location data
    Object.keys(this.knowledgeMapping.locations).forEach(fileName => {
      const keywords = this.knowledgeMapping.locations[fileName];
      if (keywords.some(keyword => lowerMessage.includes(keyword)) ||
          (userContext.location && fileName.includes(userContext.location))) {
        relevantContent += `\n\n📍 Location Info: ${fileName.replace(/-/g, ' ').toUpperCase()}\n${this.restaurantKnowledge.locations[fileName]}`;
        matchedFiles.push(`Location: ${fileName}`);
      }
    });

    // Search in FAQs
    Object.keys(this.restaurantKnowledge.faqs).forEach(faqCategory => {
      const faqs = this.restaurantKnowledge.faqs[faqCategory];
      if (faqs.staff_faqs) {
        faqs.staff_faqs.forEach(faq => {
          if (lowerMessage.includes(faq.question.toLowerCase().substring(0, 10))) {
            relevantContent += `\n\n❓ FAQ: ${faq.question}\n✅ Answer: ${faq.answer}`;
            matchedFiles.push(`FAQ: ${faq.question}`);
          }
        });
      }
    });

    if (matchedFiles.length > 0) {
      console.log(`🎯 Found relevant knowledge: ${matchedFiles.join(', ')}`);
    }

    return relevantContent;
  }

  // Auto-detect language from message (Default to Hinglish)
  detectLanguage(message) {
    const hindiPattern = /[\u0900-\u097F]/; // Devanagari script
    const hindiWords = ['क्या', 'कैसे', 'कहाँ', 'कब', 'क्यों', 'है', 'हैं', 'का', 'की', 'के', 'में', 'से', 'को', 'और', 'या', 'नहीं', 'हाँ', 'जी', 'मैं', 'आप', 'हम', 'वह', 'यह', 'बताओ', 'बताइए', 'मदद', 'सहायता'];
    const hinglishWords = ['kya', 'kaise', 'kahan', 'kab', 'kyon', 'hai', 'hain', 'ji', 'aap', 'main', 'help', 'batao', 'bataiye', 'madad'];
    
    // Check for pure Devanagari script
    if (hindiPattern.test(message)) {
      return 'hindi';
    }
    
    const lowerMessage = message.toLowerCase();
    
    // Check for Hinglish words (Roman Hindi + English mix)
    const hinglishFound = hinglishWords.some(word => lowerMessage.includes(word));
    const hindiRomanFound = hindiWords.some(word => {
      const romanized = this.romanizeHindi(word);
      return lowerMessage.includes(romanized);
    });
    
    if (hinglishFound || hindiRomanFound) {
      return 'hinglish';
    }
    
    // Default to Hinglish for restaurant staff communication
    return 'hinglish';
  }

  // Simple Hindi romanization for common words
  romanizeHindi(word) {
    const romanMap = {
      'क्या': 'kya',
      'कैसे': 'kaise', 
      'कहाँ': 'kahan',
      'कब': 'kab',
      'क्यों': 'kyon',
      'है': 'hai',
      'हैं': 'hain',
      'मैं': 'main',
      'आप': 'aap',
      'बताओ': 'batao',
      'बताइए': 'bataiye',
      'मदद': 'madad',
      'सहायता': 'sahayata'
    };
    return romanMap[word] || word;
  }

  async processMessage(message, userContext) {
    try {
      console.log(`🔍 Processing: "${message}" for role: ${userContext.role}`);
      
      // Use simple role-based response system (no complex knowledge base)
      const userName = userContext.name || 'Ji';
      const userRole = userContext.role || 'trainee';
      
      // Get perfect role-based response
      const response = getRoleBasedResponse(userRole, message, userName);
      
      console.log(`✅ Role-based response generated for ${userRole}`);
      return response;
      
    } catch (error) {
      console.error('🚨 AI Service Error:', error.message);
      
      // Simple fallback
      const userName = userContext.name || 'Ji';
      return `Sorry ${userName}! 🙏\n\nKuch technical problem hai. Please thoda wait karke phir try kariye.\n\nBasic help ke liye:\n• "dal makhani recipe"\n• "hygiene rules"\n• "training"\n\nDaily Tip: Patience aur practice se sab kuch seekh sakte hain! ✨`;
    }
  }

  // Format content for better readability
  formatContent(content, language) {
    if (!content) return '';
    
    // Clean up the content
    let formatted = content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    // Add proper formatting
    formatted = formatted
      .replace(/(\d+\))/g, '\n$1')  // Add line breaks before numbered lists
      .replace(/([•·])/g, '\n$1')   // Add line breaks before bullet points
      .replace(/Important:/gi, '\n⚠️ **Important:**')
      .replace(/Note:/gi, '\n📝 **Note:**')
      .replace(/Method:/gi, '\n👨‍🍳 **Method:**')
      .replace(/Ingredients:/gi, '\n🥘 **Ingredients:**')
      .replace(/Steps:/gi, '\n📋 **Steps:**');
    
    // Limit length and add continuation indicator
    if (formatted.length > 800) {
      formatted = formatted.substring(0, 800) + '...\n\n' + 
        (language === 'hindi' ? 
          '📖 पूरी जानकारी के लिए admin panel देखें।' : 
          '📖 For complete information, check admin panel.');
    }
    
    return formatted;
  }

  // Generate pre-configured responses based on knowledge base files
  generatePreConfiguredResponses() {
    if (!this.knowledgeMapping) {
      this.createKnowledgeMapping();
    }

    const responses = {
      recipes: {},
      sops: {},
      training: {},
      locations: {},
      quickHelp: {}
    };

    // Generate recipe responses
    Object.keys(this.restaurantKnowledge.recipes).forEach(fileName => {
      const content = this.restaurantKnowledge.recipes[fileName];
      const dishName = fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      responses.recipes[fileName] = {
        hindi: `${dishName} की recipe:\n\n${content.substring(0, 300)}...\n\nपूरी जानकारी के लिए admin panel देखें।`,
        english: `${dishName} Recipe:\n\n${content.substring(0, 300)}...\n\nFor complete details, check admin panel.`,
        keywords: this.knowledgeMapping.recipes[fileName]
      };
    });

    // Generate SOP responses
    Object.keys(this.restaurantKnowledge.sops).forEach(fileName => {
      const content = this.restaurantKnowledge.sops[fileName];
      const sopName = fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      responses.sops[fileName] = {
        hindi: `${sopName} के नियम:\n\n${content.substring(0, 300)}...\n\nसभी staff को इन नियमों का पालन करना जरूरी है।`,
        english: `${sopName} Guidelines:\n\n${content.substring(0, 300)}...\n\nAll staff must follow these guidelines.`,
        keywords: this.knowledgeMapping.sops[fileName]
      };
    });

    // Generate training responses
    Object.keys(this.restaurantKnowledge.training).forEach(fileName => {
      const content = this.restaurantKnowledge.training[fileName];
      const trainingName = fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      responses.training[fileName] = {
        hindi: `${trainingName} प्रशिक्षण:\n\n${content.substring(0, 300)}...\n\nअधिक जानकारी के लिए training module देखें।`,
        english: `${trainingName} Training:\n\n${content.substring(0, 300)}...\n\nFor more details, check training module.`,
        keywords: this.knowledgeMapping.training[fileName]
      };
    });

    // Generate location responses
    Object.keys(this.restaurantKnowledge.locations).forEach(fileName => {
      const content = this.restaurantKnowledge.locations[fileName];
      const locationName = fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      responses.locations[fileName] = {
        hindi: `${locationName} की जानकारी:\n\n${content.substring(0, 300)}...\n\nस्थानीय guidelines के लिए manager से संपर्क करें।`,
        english: `${locationName} Information:\n\n${content.substring(0, 300)}...\n\nContact manager for local guidelines.`,
        keywords: this.knowledgeMapping.locations[fileName]
      };
    });

    // Generate quick help based on available knowledge
    const availableTopics = [
      ...Object.keys(responses.recipes),
      ...Object.keys(responses.sops),
      ...Object.keys(responses.training)
    ];

    responses.quickHelp = {
      hindi: `मैं इन विषयों में आपकी मदद कर सकता हूं:\n\n📖 Recipes: ${Object.keys(responses.recipes).map(f => f.replace(/-/g, ' ')).join(', ')}\n\n📋 SOPs: ${Object.keys(responses.sops).map(f => f.replace(/-/g, ' ')).join(', ')}\n\n🎓 Training: ${Object.keys(responses.training).map(f => f.replace(/-/g, ' ')).join(', ')}\n\nकोई भी topic के बारे में पूछें!`,
      english: `I can help you with these topics:\n\n📖 Recipes: ${Object.keys(responses.recipes).map(f => f.replace(/-/g, ' ')).join(', ')}\n\n📋 SOPs: ${Object.keys(responses.sops).map(f => f.replace(/-/g, ' ')).join(', ')}\n\n🎓 Training: ${Object.keys(responses.training).map(f => f.replace(/-/g, ' ')).join(', ')}\n\nAsk me about any topic!`
    };

    console.log('✨ Pre-configured responses generated:', {
      recipes: Object.keys(responses.recipes).length,
      sops: Object.keys(responses.sops).length,
      training: Object.keys(responses.training).length,
      locations: Object.keys(responses.locations).length
    });

    return responses;
  }

  // Quick response matcher for common queries
  getQuickResponse(message, userContext) {
    const responses = this.generatePreConfiguredResponses();
    const lowerMessage = message.toLowerCase();
    const language = userContext.preferredLanguage || 'hindi';

    // Check for help/menu requests
    if (lowerMessage.includes('help') || lowerMessage.includes('मदद') || 
        lowerMessage.includes('menu') || lowerMessage.includes('क्या कर सकते')) {
      return responses.quickHelp[language];
    }

    // Check recipes
    for (const [fileName, response] of Object.entries(responses.recipes)) {
      if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return response[language];
      }
    }

    // Check SOPs
    for (const [fileName, response] of Object.entries(responses.sops)) {
      if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return response[language];
      }
    }

    // Check training
    for (const [fileName, response] of Object.entries(responses.training)) {
      if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return response[language];
      }
    }

    // Check locations
    for (const [fileName, response] of Object.entries(responses.locations)) {
      if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return response[language];
      }
    }

    return null; // No quick response found
  }

  async generateTaskSuggestions(role, restaurantData) {
    const prompt = `
Role: ${role}
Restaurant SOPs: ${JSON.stringify(restaurantData.sops)}
Current time: ${new Date().toLocaleString('hi-IN')}

Suggest 3 relevant tasks for this role in Hindi. Format as JSON array with title and description.
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Task generation error:', error);
      return [];
    }
  }
}

module.exports = new AIService();