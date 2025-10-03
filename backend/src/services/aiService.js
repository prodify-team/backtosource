const knowledgeLoader = require('../knowledge/knowledgeLoader');

class AIService {
  constructor() {
    console.log('🤖 Minimal AI Service initialized');
  }

  async processMessage(message, userContext) {
    try {
      console.log(`🔍 Processing: "${message}" for role: ${userContext.role}`);
      
      const userName = userContext.name || 'Ji';
      const userRole = userContext.role || 'trainee';
      
      // Find relevant content from file-based knowledge system
      const relevantContent = knowledgeLoader.findRelevantContent(message, userRole);
      
      // Generate response using structured knowledge
      const response = knowledgeLoader.generateResponse(message, userRole, userName, relevantContent);
      
      console.log(`✅ File-based knowledge response generated for ${userRole}`);
      return response;
      
    } catch (error) {
      console.error('🚨 AI Service Error:', error.message);
      
      const userName = userContext.name || 'Ji';
      return `Sorry ${userName}! 🙏\n\nTechnical issue hai. Please try:\n• "dal makhani recipe"\n• "hygiene rules"\n• "training"\n\nDaily Tip: Patience se sab kuch theek ho jayega! ✨`;
    }
  }

  async generateTaskSuggestions(role, restaurantData) {
    const taskSuggestions = {
      chef: [
        { title: "Kitchen hygiene check", description: "Daily cleanliness inspection" },
        { title: "Recipe standardization", description: "Ensure consistent taste" }
      ],
      waiter: [
        { title: "Table setup", description: "Prepare dining area" },
        { title: "Menu knowledge", description: "Learn new dishes" }
      ]
    };

    return taskSuggestions[role] || taskSuggestions.chef;
  }
}

module.exports = new AIService();