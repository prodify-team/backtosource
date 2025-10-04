const knowledgeLoader = require('../../knowledge/knowledgeLoader');
const OpenAI = require('openai');

class AIService {
  constructor() {
    console.log('🤖 AI Service with OpenAI initialized');
    
    // Initialize OpenAI
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.useOpenAI = !!process.env.OPENAI_API_KEY;
    console.log(`🔑 OpenAI ${this.useOpenAI ? 'enabled' : 'disabled (no API key)'}`);
  }

  async processMessage(message, userContext) {
    try {
      console.log(`🔍 Processing: "${message}" for role: ${userContext.role}`);
      
      const userName = userContext.name || 'Ji';
      const userRole = userContext.role || 'trainee';
      
      // Try OpenAI first if available
      if (this.useOpenAI) {
        try {
          const aiResponse = await this.getOpenAIResponse(message, userRole, userName);
          console.log(`✅ OpenAI response generated for ${userRole}`);
          return aiResponse;
        } catch (error) {
          console.log(`⚠️ OpenAI failed, falling back to knowledge base: ${error.message}`);
        }
      }
      
      // Fallback to file-based knowledge system
      const relevantContent = knowledgeLoader.findRelevantContent(message, userRole);
      const response = knowledgeLoader.generateResponse(message, userRole, userName, relevantContent);
      
      console.log(`✅ Knowledge base response generated for ${userRole}`);
      return response;
      
    } catch (error) {
      console.error('🚨 AI Service Error:', error.message);
      
      const userName = userContext.name || 'Ji';
      return `Sorry ${userName}! 🙏\n\nTechnical issue hai. Please try:\n• "dal makhani recipe"\n• "hygiene rules"\n• "training"\n\nDaily Tip: Patience se sab kuch theek ho jayega! ✨`;
    }
  }

  async getOpenAIResponse(message, userRole, userName) {
    // Retrieve relevant documents from knowledge base
    const relevantContent = knowledgeLoader.findRelevantContent(message, userRole);
    
    // Build knowledge-grounded prompt
    const knowledgePrompt = this.buildKnowledgeGroundedPrompt(message, userRole, userName, relevantContent);
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: knowledgePrompt },
        { role: "user", content: message }
      ],
      max_tokens: 600,
      temperature: 0.3, // Lower temperature for more factual responses
    });

    return response.choices[0].message.content;
  }

  buildKnowledgeGroundedPrompt(message, userRole, userName, relevantContent) {
    const baseInstructions = `You are an AI training assistant for "Back to Source" restaurant chain with 350+ team members across India.

CRITICAL INSTRUCTIONS:
- Answer ONLY using the knowledge base provided below
- If information is not in the knowledge base, say "I don't have that specific information in my training materials"
- Always cite the source document when providing information
- Respond in Hinglish (Hindi + English mix) as the team communicates
- Address the user as "${userName} Ji" respectfully
- Include emojis and use "Wrong Way vs Right Way" format when appropriate

KNOWLEDGE BASE (use ONLY this information to answer):
${this.formatKnowledgeContent(relevantContent)}

USER CONTEXT:
- Role: ${userRole}
- Name: ${userName}
- Restaurant: Back to Source

RESPONSE FORMAT:
- Be practical and actionable
- Include source references like "(Source: Recipe Guide)" 
- End with a relevant daily tip when appropriate
- Keep responses concise but informative`;

    return baseInstructions;
  }

  formatKnowledgeContent(relevantContent) {
    if (!relevantContent || relevantContent.length === 0) {
      return "No specific knowledge base content found for this query. Use general restaurant industry knowledge.";
    }

    return relevantContent.map((doc, index) => {
      return `--- DOCUMENT ${index + 1}: ${doc.source || 'Knowledge Base'} ---
${doc.content}
--- END DOCUMENT ${index + 1} ---`;
    }).join('\n\n');
  }

  getSystemPrompt(userRole, userName) {
    const basePrompt = `You are a helpful AI assistant for "Back to Source" restaurant chain with 350+ team members across multiple locations in India. You help with training, recipes, hygiene, customer service, and daily tasks.

IMPORTANT GUIDELINES:
- Always respond in Hinglish (Hindi + English mix) as that's how the team communicates
- Address the user as "${userName} Ji" respectfully
- Be practical, actionable, and restaurant-focused
- Include emojis to make responses engaging
- Use "Wrong Way vs Right Way" format when giving advice
- End with a "Daily Tip" when appropriate
- Keep responses concise but informative

RESTAURANT CONTEXT:
- Back to Source is a premium Indian restaurant chain
- Focus on authentic Indian cuisine, especially North Indian
- Signature dishes include Dal Makhani, Butter Chicken, Naan
- High standards for hygiene, service, and food quality
- Team includes chefs, waiters, delivery staff, supervisors, trainees`;

    const roleSpecificPrompts = {
      chef: `\nROLE: You're helping a CHEF (${userName})
- Focus on cooking techniques, recipes, kitchen management
- Emphasize food safety, hygiene, and quality control
- Share advanced cooking tips and ingredient knowledge
- Help with team training and kitchen efficiency`,

      waiter: `\nROLE: You're helping a WAITER (${userName})
- Focus on customer service excellence and upselling
- Share menu knowledge and food pairing suggestions
- Help with order management and guest interaction
- Emphasize professional service standards`,

      'delivery-boy': `\nROLE: You're helping a DELIVERY PERSON (${userName})
- Focus on safe delivery practices and customer interaction
- Share tips for maintaining food quality during delivery
- Help with route optimization and time management
- Emphasize professional delivery standards`,

      supervisor: `\nROLE: You're helping a SUPERVISOR (${userName})
- Focus on team management and quality control
- Share leadership tips and training guidance
- Help with performance monitoring and problem solving
- Emphasize maintaining restaurant standards`,

      manager: `\nROLE: You're helping a MANAGER (${userName})
- Focus on operations management and team leadership
- Share business insights and efficiency improvements
- Help with staff training and customer satisfaction
- Emphasize overall restaurant performance`,

      trainee: `\nROLE: You're helping a TRAINEE (${userName})
- Focus on basic learning and skill development
- Share fundamental restaurant knowledge step-by-step
- Help with understanding company culture and values
- Emphasize learning patience and asking questions`
    };

    return basePrompt + (roleSpecificPrompts[userRole] || roleSpecificPrompts.trainee);
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