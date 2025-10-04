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

  // Find relevant knowledge based on query and role - returns array of documents
  findRelevantContent(query, userRole) {
    const lowerQuery = query.toLowerCase();
    const relevantDocs = [];

    // Check recipes
    if (lowerQuery.includes('dal makhani') || lowerQuery.includes('दाल मखनी') || lowerQuery.includes('recipe')) {
      const dalMakhani = this.knowledge.recipes['dal-makhani'];
      if (dalMakhani && dalMakhani.content[userRole]) {
        relevantDocs.push({
          source: `Recipe Guide - ${dalMakhani.title}`,
          content: this.formatDocumentContent(dalMakhani.content[userRole], 'recipe', userRole),
          type: 'recipe',
          title: dalMakhani.title
        });
      }
    }
    
    // Check hygiene/SOPs
    if (lowerQuery.includes('hygiene') || lowerQuery.includes('सफाई') || lowerQuery.includes('cleanliness') || lowerQuery.includes('sop')) {
      const hygiene = this.knowledge.sops['kitchen-hygiene'];
      if (hygiene && hygiene.content[userRole]) {
        relevantDocs.push({
          source: `SOP Manual - ${hygiene.title}`,
          content: this.formatDocumentContent(hygiene.content[userRole], 'sop', userRole),
          type: 'sop',
          title: hygiene.title
        });
      }
    }
    
    // Check training
    if (lowerQuery.includes('training') || lowerQuery.includes('प्रशिक्षण') || lowerQuery.includes('सिखाना') || lowerQuery.includes('learn')) {
      const training = this.knowledge.training['role-based-training'];
      if (training && training.content[userRole]) {
        relevantDocs.push({
          source: `Training Manual - ${training.title}`,
          content: this.formatDocumentContent(training.content[userRole], 'training', userRole),
          type: 'training',
          title: training.title
        });
      }
    }

    // If no specific match, include general role-based content
    if (relevantDocs.length === 0) {
      relevantDocs.push({
        source: `General Guidelines - ${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Role`,
        content: this.getGeneralRoleContent(userRole),
        type: 'general',
        title: 'Role Guidelines'
      });
    }

    return relevantDocs;
  }

  formatDocumentContent(content, type, userRole) {
    let formatted = '';
    
    if (type === 'recipe') {
      formatted += `RECIPE INFORMATION:\n`;
      if (content.ingredients) formatted += `Ingredients: ${content.ingredients.slice(0, 5).join(', ')}\n`;
      if (content.method) formatted += `Method: ${content.method.slice(0, 3).join(' → ')}\n`;
      if (content.cookingTime) formatted += `Cooking Time: ${content.cookingTime}\n`;
      if (content.description) formatted += `Description: ${content.description}\n`;
      if (content.wrongWay) formatted += `Wrong Way: ${content.wrongWay}\n`;
      if (content.rightWay) formatted += `Right Way: ${content.rightWay}\n`;
      if (content.assignment) formatted += `Assignment: ${content.assignment}\n`;
      if (content.dailyTip) formatted += `Daily Tip: ${content.dailyTip}`;
    }
    else if (type === 'sop') {
      formatted += `STANDARD OPERATING PROCEDURE:\n`;
      if (content.standards) formatted += `Standards: ${content.standards.slice(0, 3).join('; ')}\n`;
      if (content.responsibilities) formatted += `Responsibilities: ${content.responsibilities.slice(0, 3).join('; ')}\n`;
      if (content.wrongWay) formatted += `Wrong Way: ${content.wrongWay}\n`;
      if (content.rightWay) formatted += `Right Way: ${content.rightWay}\n`;
      if (content.assignment) formatted += `Assignment: ${content.assignment}\n`;
      if (content.dailyTip) formatted += `Daily Tip: ${content.dailyTip}`;
    }
    else if (type === 'training') {
      formatted += `TRAINING INFORMATION:\n`;
      if (content.modules) formatted += `Modules: ${content.modules.slice(0, 3).join('; ')}\n`;
      if (content.skills) formatted += `Skills: ${content.skills.slice(0, 3).join('; ')}\n`;
      if (content.wrongWay) formatted += `Wrong Way: ${content.wrongWay}\n`;
      if (content.rightWay) formatted += `Right Way: ${content.rightWay}\n`;
      if (content.assignment) formatted += `Assignment: ${content.assignment}\n`;
      if (content.dailyTip) formatted += `Daily Tip: ${content.dailyTip}`;
    }

    return formatted;
  }

  getGeneralRoleContent(userRole) {
    const roleContent = {
      chef: `CHEF RESPONSIBILITIES:
- Kitchen management and food preparation
- Team training and quality control
- Recipe standardization and innovation
- Food safety and hygiene compliance
- Inventory management and cost control`,

      waiter: `WAITER RESPONSIBILITIES:
- Customer service excellence and satisfaction
- Order taking and menu knowledge
- Upselling and revenue optimization
- Table management and service standards
- Guest complaint resolution`,

      trainee: `TRAINEE LEARNING PATH:
- Basic restaurant operations understanding
- Company culture and values adoption
- Role-specific skill development
- Mentorship and guidance seeking
- Continuous learning and improvement`,

      supervisor: `SUPERVISOR RESPONSIBILITIES:
- Team coordination and management
- Quality assurance and standards maintenance
- Performance monitoring and feedback
- Training facilitation and development
- Problem resolution and escalation`,

      manager: `MANAGER RESPONSIBILITIES:
- Overall operations management
- Staff scheduling and resource allocation
- Financial performance and cost control
- Customer satisfaction and retention
- Strategic planning and execution`
    };

    return roleContent[userRole] || roleContent.trainee;
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