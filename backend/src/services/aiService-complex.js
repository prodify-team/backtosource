const { roleBasedKnowledge, getRoleBasedResponse } = require('../knowledge/role-based-responses');

// Try to initialize OpenAI, but don't crash if it fails
let openai = null;
try {
  const OpenAI = require('openai');
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI initialized successfully');
  } else {
    console.log('⚠️ OpenAI API key not found, using fallback responses');
  }
} catch (error) {
  console.log('⚠️ OpenAI not available, using fallback responses:', error.message);
}

class AIService {
  constructor() {
    console.log('🤖 AI Service initialized with role-based responses');
  }

  async processMessage(message, userContext) {
    try {
      console.log(`🔍 Processing: "${message}" for role: ${userContext.role}`);
      
      const userName = userContext.name || 'Ji';
      const userRole = userContext.role || 'trainee';
      
      // Find relevant knowledge base content
      const knowledgeContent = this.findRelevantKnowledge(message, userRole);
      
      // Build role-specific system prompt with your custom instructions
      const systemPrompt = this.buildRoleSpecificPrompt(userRole, userName, knowledgeContent);
      
      // Try OpenAI first, fallback to knowledge base
      if (openai) {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            max_tokens: 600,
            temperature: 0.7,
          });

          console.log(`✅ Creative AI response generated for ${userRole}`);
          return response.choices[0].message.content;
        } catch (openaiError) {
          console.log('⚠️ OpenAI failed, using knowledge base:', openaiError.message);
        }
      }
      
      // Fallback to enhanced knowledge base response
      console.log(`📚 Using enhanced knowledge base response for ${userRole}`);
      return this.getEnhancedKnowledgeResponse(message, userContext, knowledgeContent);
      
    } catch (error) {
      console.error('🚨 AI Service Error:', error.message);
      
      // Fallback to knowledge base if OpenAI fails
      const response = this.getFallbackResponse(message, userContext);
      return response;
    }
  }

  findRelevantKnowledge(message, userRole) {
    const lowerMessage = message.toLowerCase();
    const roleKnowledge = roleBasedKnowledge[userRole] || roleBasedKnowledge['trainee'];
    
    let relevantContent = '';
    
    // Check for dal makhani
    if (lowerMessage.includes('dal makhani') || lowerMessage.includes('दाल मखनी')) {
      relevantContent = roleKnowledge['dal makhani']?.response || '';
    }
    // Check for hygiene
    else if (lowerMessage.includes('hygiene') || lowerMessage.includes('सफाई') || lowerMessage.includes('cleanliness')) {
      relevantContent = roleKnowledge['hygiene']?.response || '';
    }
    // Check for training
    else if (lowerMessage.includes('training') || lowerMessage.includes('प्रशिक्षण') || lowerMessage.includes('सिखाना')) {
      relevantContent = roleKnowledge['training']?.response || '';
    }
    
    return relevantContent;
  }

  buildRoleSpecificPrompt(userRole, userName, knowledgeContent) {
    const basePrompt = `You are the official Employee Training & Task Bot for Back to Source and Chota Banaras restaurants.

CRITICAL INSTRUCTIONS (Follow Exactly):
- Speak in short, clear Hinglish sentences with respect, positivity, and Indian warmth
- Format all replies in simple, well-spaced bullet points
- Keep every response under 200 words
- Always teach with Wrong Way vs Right Way examples from real restaurant situations
- Give small assignments after lessons and check answers using respect keywords like "Sorry Ji" or "Namaste Ji"
- Correct gently, never insult
- End replies with a short Daily Tip whenever possible
- Use respect keywords: Ji, Please, Sorry, Namaste
- Ask clarifying questions if the employee's request is not clear

USER CONTEXT:
- Name: ${userName}
- Role: ${userRole}
- Restaurant: Back to Source & Chota Banaras

COMPANY VALUES TO REINFORCE:
- Happiness and mutual respect
- No discrimination policy
- Discipline with compassion
- Indian cultural roots
- Meditation and mindfulness`;

    // Add role-specific focus
    const roleFocus = {
      chef: "Focus on cooking techniques, recipes, kitchen management, food safety. Use expert culinary guidance tone.",
      waiter: "Focus on customer service, menu knowledge, order taking, table management. Use warm hospitality tone.",
      "delivery-boy": "Focus on delivery protocols, customer interaction, safety guidelines. Use safety-first tone.",
      supervisor: "Focus on team coordination, quality control, training guidance. Use leadership tone.",
      trainee: "Focus on basic guidance, learning materials, step-by-step instructions. Use encouraging tone."
    };

    const prompt = basePrompt + `\n\nROLE-SPECIFIC FOCUS: ${roleFocus[userRole] || roleFocus.trainee}`;

    // Add knowledge base content if available
    if (knowledgeContent) {
      return prompt + `\n\nKNOWLEDGE BASE REFERENCE:\n${knowledgeContent}\n\nUse this as factual reference but make your response creative, engaging, and personalized for ${userName}. Don't just copy - be creative while staying accurate.`;
    }

    return prompt + `\n\nNo specific knowledge base content found. Provide helpful, role-appropriate guidance based on your training about restaurant operations.`;
  }

  getEnhancedKnowledgeResponse(message, userContext, knowledgeContent) {
    const userName = userContext.name || 'Ji';
    const userRole = userContext.role || 'trainee';
    
    if (knowledgeContent) {
      // Enhance the knowledge base response with personalization
      const personalizedResponse = knowledgeContent
        .replace(/🙏/g, `🙏`)
        .replace(/Namaste.*?!/g, `Namaste ${userName}!`)
        .replace(/Ji!/g, `${userName} Ji!`);
      
      return personalizedResponse;
    }
    
    // Use the original getRoleBasedResponse as fallback
    return getRoleBasedResponse(userRole, message, userName);
  }

  getFallbackResponse(message, userContext) {
    const userName = userContext.name || 'Ji';
    return `Namaste ${userName}! 🙏\n\nSorry Ji, technical issue hai but main basic help kar sakta hun:\n\n• **"dal makhani recipe"** - Cooking guidance\n• **"hygiene rules"** - Safety guidelines\n• **"training"** - Learning modules\n\nKya specific help chahiye?\n\n**Daily Tip:** Questions puchna achhi baat hai - learning ka sign hai! 💡`;
  }

  async generateTaskSuggestions(role, restaurantData) {
    // Simple task suggestions based on role
    const taskSuggestions = {
      chef: [
        { title: "Kitchen hygiene check", description: "Daily cleanliness inspection" },
        { title: "Recipe standardization", description: "Ensure consistent taste" },
        { title: "Team training", description: "Train junior chefs" }
      ],
      waiter: [
        { title: "Table setup", description: "Prepare dining area" },
        { title: "Menu knowledge", description: "Learn new dishes" },
        { title: "Customer feedback", description: "Collect guest reviews" }
      ],
      "delivery-boy": [
        { title: "Vehicle check", description: "Safety inspection" },
        { title: "Route planning", description: "Optimize delivery routes" },
        { title: "Customer service", description: "Polite delivery interaction" }
      ]
    };

    return taskSuggestions[role] || taskSuggestions.chef;
  }
}

module.exports = new AIService();