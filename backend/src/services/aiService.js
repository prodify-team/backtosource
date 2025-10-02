const OpenAI = require('openai');
const KnowledgeBase = require('../models/KnowledgeBase');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  constructor() {
    this.systemPrompt = `
आप "Back to Source" रेस्टोरेंट के लिए एक AI सहायक हैं। 

IMPORTANT INSTRUCTIONS:
- आप ONLY उसी knowledge का उपयोग करें जो आपको provided की गई है
- अगर provided knowledge में जानकारी नहीं है, तो clearly बताएं कि "यह जानकारी हमारे knowledge base में उपलब्ध नहीं है"
- कभी भी अपनी general knowledge का उपयोग न करें
- हमेशा provided documents के exact information को follow करें

Back to Source Details:
- 350+ team members across multiple locations
- Specializes in authentic Indian slow cooking
- Professional restaurant chain

आपकी भूमिका:
1. केवल provided knowledge base से जानकारी देना
2. अगर जानकारी available नहीं है तो स्पष्ट रूप से बताना
3. Provided documents के अनुसार accurate information देना
4. Professional और helpful tone maintain करना

Response Format:
- अगर knowledge available है: Detailed answer from knowledge base
- अगर knowledge नहीं है: "यह जानकारी हमारे current knowledge base में उपलब्ध नहीं है। कृपया admin से contact करें।"
`;
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

  async processMessage(message, userContext) {
    try {
      // First, try to get a quick pre-configured response
      const quickResponse = this.getQuickResponse(message, userContext);
      if (quickResponse) {
        console.log('🚀 Quick response provided from knowledge base files');
        return quickResponse;
      }

      // Search knowledge base for relevant information
      const relevantDocs = await KnowledgeBase.searchKnowledge(message);
      
      // Also search in file-based knowledge
      const fileBasedKnowledge = this.findRelevantKnowledge(message, userContext);
      
      // Build contextual prompt with ONLY knowledge base information
      let contextualPrompt = this.systemPrompt;
      
      // Add role-specific context
      if (userContext.role === 'chef' || userContext.role === 'head-chef') {
        contextualPrompt += `\n\nUser is a chef. Focus on cooking techniques, recipes, kitchen management, and food safety from provided knowledge.`;
      } else if (userContext.role === 'waiter') {
        contextualPrompt += `\n\nUser is a waiter. Focus on customer service, menu knowledge, order taking from provided knowledge.`;
      } else if (userContext.role === 'delivery-boy') {
        contextualPrompt += `\n\nUser is a delivery person. Focus on delivery protocols, customer interaction, safety guidelines from provided knowledge.`;
      } else if (userContext.role === 'supervisor') {
        contextualPrompt += `\n\nUser is a supervisor. Focus on team coordination, quality control, training guidance from provided knowledge.`;
      } else if (userContext.role === 'trainee') {
        contextualPrompt += `\n\nUser is a trainee. Provide basic guidance, learning materials, step-by-step instructions from provided knowledge.`;
      } else if (userContext.role.includes('manager') || userContext.role === 'owner') {
        contextualPrompt += `\n\nUser is in management. Focus on operations, staff management from provided knowledge.`;
      }

      // Add relevant knowledge from both database and files
      let hasKnowledge = false;
      
      if (relevantDocs && relevantDocs.length > 0) {
        contextualPrompt += `\n\n=== DATABASE KNOWLEDGE BASE ===`;
        relevantDocs.forEach((doc, index) => {
          contextualPrompt += `\n\nDocument ${index + 1}: ${doc.title} (Category: ${doc.category})`;
          contextualPrompt += `\nContent: ${doc.content}`;
          contextualPrompt += `\nTags: ${doc.tags.join(', ')}`;
        });
        contextualPrompt += `\n\n=== END DATABASE KNOWLEDGE ===`;
        hasKnowledge = true;
      }

      if (fileBasedKnowledge) {
        contextualPrompt += `\n\n=== FILE-BASED KNOWLEDGE ===`;
        contextualPrompt += fileBasedKnowledge;
        contextualPrompt += `\n\n=== END FILE KNOWLEDGE ===`;
        hasKnowledge = true;
      }

      if (hasKnowledge) {
        contextualPrompt += `\n\nIMPORTANT: Use ONLY the information provided above. If the answer is not in the knowledge base, say so clearly.`;
      } else {
        contextualPrompt += `\n\nNo relevant information found in knowledge base for this query.`;
      }

      // Check for task-related queries (these don't need knowledge base)
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('task') || lowerMessage.includes('काम') || lowerMessage.includes('कार्य')) {
        contextualPrompt += `\n\nUser is asking about tasks. You can help with task management commands like "show my tasks", "task completed", etc.`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: contextualPrompt },
          { role: "user", content: `Role: ${userContext.role} | Location: ${userContext.location || 'Unknown'} | Language: ${userContext.preferredLanguage} | Message: ${message}` }
        ],
        max_tokens: 800,
        temperature: 0.3, // Lower temperature for more consistent responses
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Strict fallback - only use knowledge base
      const relevantDocs = await KnowledgeBase.searchKnowledge(message);
      
      if (relevantDocs && relevantDocs.length > 0) {
        const topDoc = relevantDocs[0];
        return userContext.preferredLanguage === 'hindi' ? 
          `Knowledge Base से मिली जानकारी:\n\n${topDoc.title}\n\n${topDoc.content.substring(0, 500)}...` :
          `Information from Knowledge Base:\n\n${topDoc.title}\n\n${topDoc.content.substring(0, 500)}...`;
      }
      
      return userContext.preferredLanguage === 'hindi' ? 
        'माफ करें, यह जानकारी हमारे current knowledge base में उपलब्ध नहीं है। कृपया admin से contact करें या knowledge base में relevant documents add करें।' :
        'Sorry, this information is not available in our current knowledge base. Please contact admin or add relevant documents to the knowledge base.';
    }
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