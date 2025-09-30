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

  findRelevantKnowledge(message, userContext) {
    const lowerMessage = message.toLowerCase();
    let relevantContent = '';

    // Check for recipe queries
    Object.keys(this.restaurantKnowledge.recipes).forEach(recipe => {
      if (lowerMessage.includes(recipe.replace('-', ' ')) || 
          lowerMessage.includes(recipe.replace('-', ''))) {
        relevantContent += `\n\nRecipe Knowledge:\n${this.restaurantKnowledge.recipes[recipe]}`;
      }
    });

    // Check for SOP queries
    if (lowerMessage.includes('hygiene') || lowerMessage.includes('safety') || 
        lowerMessage.includes('clean') || lowerMessage.includes('सफाई')) {
      Object.keys(this.restaurantKnowledge.sops).forEach(sop => {
        if (sop.includes('hygiene') || sop.includes('safety')) {
          relevantContent += `\n\nSOP Knowledge:\n${this.restaurantKnowledge.sops[sop]}`;
        }
      });
    }

    // Check for training queries
    if (lowerMessage.includes('training') || lowerMessage.includes('new') || 
        lowerMessage.includes('learn') || lowerMessage.includes('सीखना')) {
      Object.keys(this.restaurantKnowledge.training).forEach(training => {
        if (userContext.role && training.includes(userContext.role)) {
          relevantContent += `\n\nTraining Material:\n${this.restaurantKnowledge.training[training]}`;
        }
      });
    }

    // Check FAQs
    Object.keys(this.restaurantKnowledge.faqs).forEach(faqCategory => {
      const faqs = this.restaurantKnowledge.faqs[faqCategory];
      if (faqs.staff_faqs) {
        faqs.staff_faqs.forEach(faq => {
          if (lowerMessage.includes(faq.question.toLowerCase().substring(0, 10))) {
            relevantContent += `\n\nFAQ: ${faq.question}\nAnswer: ${faq.answer}`;
          }
        });
      }
    });

    return relevantContent;
  }

  async processMessage(message, userContext) {
    try {
      // Search knowledge base for relevant information
      const relevantDocs = KnowledgeBase.searchKnowledge(message);
      
      // Build contextual prompt with ONLY knowledge base information
      let contextualPrompt = this.systemPrompt;
      
      // Add role-specific context
      if (userContext.role === 'chef' || userContext.role === 'head-chef') {
        contextualPrompt += `\n\nUser is a chef. Focus on cooking techniques, recipes, kitchen management, and food safety from provided knowledge.`;
      } else if (userContext.role === 'waiter') {
        contextualPrompt += `\n\nUser is a waiter. Focus on customer service, menu knowledge, order taking from provided knowledge.`;
      } else if (userContext.role.includes('manager') || userContext.role === 'owner') {
        contextualPrompt += `\n\nUser is in management. Focus on operations, staff management from provided knowledge.`;
      }

      // Add relevant knowledge from knowledge base ONLY
      if (relevantDocs && relevantDocs.length > 0) {
        contextualPrompt += `\n\n=== AVAILABLE KNOWLEDGE BASE ===`;
        relevantDocs.forEach((doc, index) => {
          contextualPrompt += `\n\nDocument ${index + 1}: ${doc.title} (Category: ${doc.category})`;
          contextualPrompt += `\nContent: ${doc.content}`;
          contextualPrompt += `\nTags: ${doc.tags.join(', ')}`;
        });
        contextualPrompt += `\n\n=== END KNOWLEDGE BASE ===`;
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
      const relevantDocs = KnowledgeBase.searchKnowledge(message);
      
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