const fs = require('fs');
const path = require('path');

class KnowledgeLoader {
  constructor() {
    this.knowledge = {};
    this.loadAllKnowledge();
  }

  loadAllKnowledge() {
    try {
      // Load recipes
      this.knowledge.recipes = {
        'dal-makhani': require('./recipes/dal-makhani')
      };

      // Load SOPs
      this.knowledge.sops = {
        'kitchen-hygiene': require('./sops/kitchen-hygiene')
      };

      // Load training
      this.knowledge.training = {
        'role-based-training': require('./training/role-based-training')
      };

      console.log('✅ Knowledge base loaded successfully');
      console.log(`📚 Loaded: ${Object.keys(this.knowledge.recipes).length} recipes, ${Object.keys(this.knowledge.sops).length} SOPs, ${Object.keys(this.knowledge.training).length} training modules`);
      
    } catch (error) {
      console.error('❌ Error loading knowledge base:', error.message);
    }
  }

  // Find relevant knowledge based on query and role
  findRelevantContent(query, userRole) {
    const lowerQuery = query.toLowerCase();
    let relevantContent = null;

    // Check recipes
    if (lowerQuery.includes('dal makhani') || lowerQuery.includes('दाल मखनी') || lowerQuery.includes('recipe')) {
      const dalMakhani = this.knowledge.recipes['dal-makhani'];
      if (dalMakhani && dalMakhani.content[userRole]) {
        relevantContent = {
          type: 'recipe',
          title: dalMakhani.title,
          content: dalMakhani.content[userRole],
          category: dalMakhani.category
        };
      }
    }
    
    // Check hygiene/SOPs
    else if (lowerQuery.includes('hygiene') || lowerQuery.includes('सफाई') || lowerQuery.includes('cleanliness') || lowerQuery.includes('sop')) {
      const hygiene = this.knowledge.sops['kitchen-hygiene'];
      if (hygiene && hygiene.content[userRole]) {
        relevantContent = {
          type: 'sop',
          title: hygiene.title,
          content: hygiene.content[userRole],
          category: hygiene.category
        };
      }
    }
    
    // Check training
    else if (lowerQuery.includes('training') || lowerQuery.includes('प्रशिक्षण') || lowerQuery.includes('सिखाना') || lowerQuery.includes('learn')) {
      const training = this.knowledge.training['role-based-training'];
      if (training && training.content[userRole]) {
        relevantContent = {
          type: 'training',
          title: training.title,
          content: training.content[userRole],
          category: training.category
        };
      }
    }

    return relevantContent;
  }

  // Generate response based on found content
  generateResponse(query, userRole, userName, relevantContent) {
    if (!relevantContent) {
      return this.getDefaultResponse(userRole, userName);
    }

    const content = relevantContent.content;
    let response = `Namaste ${userName}! 🙏\n\n`;

    // Format response based on content type
    if (relevantContent.type === 'recipe') {
      response += this.formatRecipeResponse(content, userRole);
    } else if (relevantContent.type === 'sop') {
      response += this.formatSOPResponse(content, userRole);
    } else if (relevantContent.type === 'training') {
      response += this.formatTrainingResponse(content, userRole);
    }

    return response;
  }

  formatRecipeResponse(content, userRole) {
    let response = '';
    
    if (userRole === 'chef') {
      response += `👨‍🍳 **Dal Makhani - Chef Level Recipe**\n\n`;
      response += `• **Ingredients:** ${content.ingredients.slice(0, 5).join(', ')}\n\n`;
      response += `• **Method:**\n`;
      content.method.forEach((step, index) => {
        response += `  ${index + 1}. ${step}\n`;
      });
      response += `\n• **Wrong Way:** ${content.wrongWay}\n`;
      response += `• **Right Way:** ${content.rightWay}\n\n`;
      response += `• **Chef Assignment:** ${content.assignment}\n\n`;
      response += `• **Daily Tip:** ${content.dailyTip}`;
    } 
    else if (userRole === 'waiter') {
      response += `🍽️ **Dal Makhani - Service Knowledge**\n\n`;
      response += `• **Description:** ${content.description}\n`;
      response += `• **Cooking Time:** ${content.cookingTime}\n`;
      response += `• **Pairing:** ${content.pairingOptions.join(', ')}\n`;
      response += `• **Guest Story:** ${content.guestDescription}\n\n`;
      response += `• **Wrong Way:** ${content.wrongWay}\n`;
      response += `• **Right Way:** ${content.rightWay}\n\n`;
      response += `• **Assignment:** ${content.assignment}\n\n`;
      response += `• **Daily Tip:** ${content.dailyTip}`;
    }
    else if (userRole === 'trainee') {
      response += `📚 **Dal Makhani - Learning Basics**\n\n`;
      response += `• **What is it:** ${content.basicInfo}\n\n`;
      response += `• **Key Points:**\n`;
      content.keyPoints.forEach(point => {
        response += `  - ${point}\n`;
      });
      response += `\n• **Why Special:** ${content.whySpecial}\n\n`;
      response += `• **Wrong Way:** ${content.wrongWay}\n`;
      response += `• **Right Way:** ${content.rightWay}\n\n`;
      response += `• **Assignment:** ${content.assignment}\n\n`;
      response += `• **Daily Tip:** ${content.dailyTip}`;
    }

    return response;
  }

  formatSOPResponse(content, userRole) {
    let response = `🧼 **Kitchen Hygiene - ${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Standards**\n\n`;
    
    if (content.standards) {
      response += `• **Standards:**\n`;
      content.standards.forEach(standard => {
        response += `  - ${standard}\n`;
      });
    }

    if (content.responsibilities) {
      response += `\n• **Responsibilities:**\n`;
      content.responsibilities.forEach(resp => {
        response += `  - ${resp}\n`;
      });
    }

    response += `\n• **Wrong Way:** ${content.wrongWay}\n`;
    response += `• **Right Way:** ${content.rightWay}\n\n`;
    response += `• **Assignment:** ${content.assignment}\n\n`;
    response += `• **Daily Tip:** ${content.dailyTip}`;

    return response;
  }

  formatTrainingResponse(content, userRole) {
    let response = `🎓 **Training Program - ${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Development**\n\n`;
    
    if (content.modules) {
      response += `• **Training Modules:**\n`;
      content.modules.slice(0, 4).forEach(module => {
        response += `  - ${module}\n`;
      });
    }

    if (content.skills) {
      response += `\n• **Key Skills:**\n`;
      content.skills.slice(0, 3).forEach(skill => {
        response += `  - ${skill}\n`;
      });
    }

    response += `\n• **Wrong Way:** ${content.wrongWay}\n`;
    response += `• **Right Way:** ${content.rightWay}\n\n`;
    response += `• **Assignment:** ${content.assignment}\n\n`;
    response += `• **Daily Tip:** ${content.dailyTip}`;

    return response;
  }

  getDefaultResponse(userRole, userName) {
    const defaults = {
      chef: `Namaste Chef ${userName}! 👨‍🍳\n\nMain aapki help kar sakta hun:\n\n• **"dal makhani recipe"** - Complete cooking guide\n• **"hygiene rules"** - Kitchen safety standards\n• **"training"** - Team development guidance\n\nKya specific help chahiye?`,
      
      waiter: `Namaste ${userName}! 🍽️\n\nMain aapki service mein help kar sakta hun:\n\n• **"dal makhani"** - Guest explanation guide\n• **"hygiene"** - Service cleanliness standards\n• **"training"** - Customer service skills\n\nKya janna chahte hain?`,
      
      "delivery-boy": `Namaste ${userName}! 🚚\n\nDelivery guidance:\n\n• **"hygiene rules"** - Safe delivery protocols\n• **"training"** - Professional delivery skills\n\nKya help chahiye?`,
      
      supervisor: `Namaste ${userName}! 👥\n\nTeam management ke liye:\n\n• **"hygiene"** - Team monitoring guidelines\n• **"training"** - Leadership development\n\nKya guidance chahiye?`,
      
      trainee: `Namaste ${userName}! 🌱\n\nLearning resources:\n\n• **"dal makhani"** - Basic dish knowledge\n• **"hygiene basics"** - Cleanliness fundamentals\n• **"training path"** - Your development journey\n\nKya seekhna chahte hain?`
    };
    
    return defaults[userRole] || defaults['trainee'];
  }
}

module.exports = new KnowledgeLoader();