// Role-Based Knowledge System for Back to Source & Chota Banaras
// Perfect responses based on user role and query

const roleBasedKnowledge = {
  
  // CHEF KNOWLEDGE
  chef: {
    "dal makhani": {
      response: `🍛 **Dal Makhani - Chef Level Recipe**

• **Ingredients:** काली दाल 1 cup, राजमा 1/4 cup, मक्खन 4 tbsp, क्रीम 1/2 cup, अदरक-लहसुन paste 2 tbsp

• **Chef Method:**
  - 8 hours soaking zaroori hai
  - Pressure cook 4-5 whistles with salt
  - Slow cook 4-6 hours on low flame
  - Tempering: cumin, onions, tomatoes
  - Final touch: cream और butter

• **Wrong Way:** Fast cooking या microwave mein banana
• **Right Way:** Traditional slow cooking with patience

• **Chef Assignment:** Practice temperature control aur timing perfect kariye

• **Daily Tip:** Authentic taste ke liye dhimi aanch pe sabr rakhiye! 🔥`,
      category: "recipe"
    },
    
    "hygiene": {
      response: `🧼 **Kitchen Hygiene - Chef Standards**

• **Hand Protocol:** 20 seconds soap wash before every task
• **Uniform Standards:** Clean apron, hair net, closed shoes
• **Food Safety:** Raw-cooked separation, FIFO rotation
• **Temperature Control:** Cold storage 4°C, hot holding 65°C+
• **Equipment:** Daily sanitization of all tools

• **Wrong Way:** Dirty hands se food handle karna
• **Right Way:** Every step mein cleanliness maintain karna

• **Chef Assignment:** Team ko hygiene training diye aur daily checklist banayiye

• **Daily Tip:** Kitchen ki cleanliness restaurant ki reputation hai! 🏆`,
      category: "hygiene"
    },
    
    "training": {
      response: `👨‍🍳 **Chef Training Modules**

• **Advanced Cooking:** Slow cooking techniques, spice balancing
• **Kitchen Management:** Team coordination, inventory control
• **Food Safety:** HACCP principles, temperature monitoring
• **Recipe Development:** Standardization, portion control
• **Leadership:** Training junior chefs, quality control

• **Wrong Way:** Bina proper training ke team ko guide karna
• **Right Way:** Systematic training aur mentoring approach

• **Chef Assignment:** 1 junior chef ko mentor kariye this week

• **Daily Tip:** Great chefs create more great chefs! 🌟`,
      category: "training"
    }
  },

  // WAITER KNOWLEDGE  
  waiter: {
    "dal makhani": {
      response: `🍽️ **Dal Makhani - Service Knowledge**

• **Description for Guests:** "Our signature slow-cooked black lentils with butter and cream"
• **Cooking Time:** 4-6 hours slow cooking process
• **Serving Style:** Hot, garnished with cream swirl
• **Pairing Suggestions:** Naan, rice, or roti
• **Allergens:** Contains dairy (butter, cream)

• **Wrong Way:** "It's just dal" kehna guests ko
• **Right Way:** Passionate description with cooking details

• **Waiter Assignment:** 5 guests ko dal makhani ki story batayiye

• **Daily Tip:** Food ki story batane se guests impressed hote hain! ✨`,
      category: "service"
    },
    
    "hygiene": {
      response: `🧽 **Service Hygiene Standards**

• **Personal Hygiene:** Clean uniform, trimmed nails, fresh breath
• **Table Service:** Sanitized hands before serving, clean serving tools
• **Guest Safety:** No touching food directly, proper plate handling
• **Dining Area:** Clean tables, chairs, floor maintenance
• **Hand Sanitizer:** Available for guests, use between tables

• **Wrong Way:** Dirty uniform mein guests ko serve karna
• **Right Way:** Impeccable presentation aur cleanliness

• **Waiter Assignment:** Today 10 tables ko perfect hygiene standards se serve kariye

• **Daily Tip:** Aapki cleanliness restaurant ka first impression hai! 👔`,
      category: "hygiene"
    },
    
    "training": {
      response: `🎯 **Waiter Training Program**

• **Customer Service:** Greeting, order taking, complaint handling
• **Menu Knowledge:** All dishes, ingredients, cooking methods
• **Upselling Techniques:** Suggest appetizers, desserts, beverages
• **Table Management:** Seating, timing, guest comfort
• **POS System:** Order entry, billing, payment processing

• **Wrong Way:** Guests ko ignore karna ya rude behavior
• **Right Way:** Warm hospitality aur proactive service

• **Waiter Assignment:** 3 new menu items ke bare mein complete knowledge gain kariye

• **Daily Tip:** Smile aapka best accessory hai! 😊`,
      category: "training"
    }
  },

  // DELIVERY BOY KNOWLEDGE
  "delivery-boy": {
    "hygiene": {
      response: `🚚 **Delivery Hygiene Protocol**

• **Personal Hygiene:** Clean uniform, helmet, sanitized hands
• **Food Safety:** Insulated bags, temperature maintenance
• **Vehicle Cleanliness:** Clean delivery box, sanitized surfaces
• **Customer Interaction:** Maintain distance, use sanitizer
• **Packaging Check:** Sealed containers, no spillage

• **Wrong Way:** Dirty delivery bag ya careless handling
• **Right Way:** Food safety priority aur professional appearance

• **Delivery Assignment:** Today 10 deliveries mein perfect hygiene maintain kariye

• **Daily Tip:** Aap restaurant ka mobile ambassador hain! 🏍️`,
      category: "hygiene"
    },
    
    "training": {
      response: `🛵 **Delivery Training Essentials**

• **Safety First:** Helmet, traffic rules, defensive driving
• **Customer Service:** Polite communication, timely delivery
• **Food Handling:** Temperature maintenance, careful transport
• **Route Optimization:** GPS usage, traffic awareness
• **Problem Solving:** Wrong address, payment issues, delays

• **Wrong Way:** Rash driving ya customer se rude behavior
• **Right Way:** Safety aur service excellence

• **Delivery Assignment:** 5 customers ko exceptional service experience diye

• **Daily Tip:** Safe delivery is successful delivery! 🛡️`,
      category: "training"
    }
  },

  // SUPERVISOR KNOWLEDGE
  supervisor: {
    "hygiene": {
      response: `👥 **Supervisor Hygiene Management**

• **Team Monitoring:** Daily hygiene checks, uniform inspection
• **Training Oversight:** Regular hygiene training sessions
• **Compliance:** Health department standards, audit preparation
• **Documentation:** Hygiene checklists, incident reports
• **Corrective Action:** Immediate fixes, staff counseling

• **Wrong Way:** Team ki hygiene ignore karna
• **Right Way:** Proactive monitoring aur continuous improvement

• **Supervisor Assignment:** Team ke liye weekly hygiene audit conduct kariye

• **Daily Tip:** Team ki hygiene aapki responsibility hai! 📋`,
      category: "hygiene"
    },
    
    "training": {
      response: `📊 **Supervisor Training Leadership**

• **Team Development:** Individual coaching, skill assessment
• **Performance Management:** Goal setting, feedback sessions
• **Quality Control:** Service standards, consistency monitoring
• **Conflict Resolution:** Team disputes, customer complaints
• **Operational Excellence:** Process improvement, efficiency

• **Wrong Way:** Team ko micromanage karna ya demotivate karna
• **Right Way:** Supportive leadership aur positive reinforcement

• **Supervisor Assignment:** 3 team members ko personalized feedback diye

• **Daily Tip:** Great supervisors create great teams! 🌟`,
      category: "training"
    }
  },

  // TRAINEE KNOWLEDGE
  trainee: {
    "dal makhani": {
      response: `📚 **Dal Makhani - Trainee Learning**

• **Basic Understanding:** Black lentils cooked slowly with spices
• **Key Ingredients:** काली दाल, राजमा, मक्खन, क्रीम
• **Cooking Process:** Long slow cooking (4-6 hours)
• **Why Special:** Traditional method, authentic taste
• **Your Role:** Learn to explain to customers

• **Wrong Way:** Complicated explanation देना
• **Right Way:** Simple, confident description

• **Trainee Assignment:** 3 experienced staff se dal makhani के बारे में और सीखिए

• **Daily Tip:** हर दिन कुछ नया सीखने की कोशिश करिए! 📖`,
      category: "learning"
    },
    
    "hygiene": {
      response: `🎓 **Hygiene Basics for Trainees**

• **Personal Hygiene:** Daily bath, clean clothes, trimmed nails
• **Hand Washing:** 20 seconds with soap, before every task
• **Food Safety:** Don't touch food directly, use gloves/tools
• **Workspace:** Keep your area clean and organized
• **Ask Questions:** When in doubt, ask supervisor

• **Wrong Way:** Hygiene rules ko ignore karna
• **Right Way:** Every rule ko seriously follow karna

• **Trainee Assignment:** Hygiene checklist banayiye aur daily follow kariye

• **Daily Tip:** Good habits शुरू से ही बनाइए! ✨`,
      category: "hygiene"
    },
    
    "training": {
      response: `🌱 **Trainee Development Path**

• **Week 1-2:** Basic hygiene, safety rules, company values
• **Week 3-4:** Role-specific skills, customer interaction
• **Week 5-6:** Advanced techniques, problem solving
• **Week 7-8:** Independence, quality standards
• **Ongoing:** Continuous learning, feedback sessions

• **Wrong Way:** Jaldi mein sab kuch seekhne ki koshish
• **Right Way:** Step by step, solid foundation banayiye

• **Trainee Assignment:** Apne mentor se daily 1 new skill seekhiye

• **Daily Tip:** Patience aur practice se perfection aati hai! 🚀`,
      category: "training"
    }
  }
};

// Helper function to get response based on role and query
function getRoleBasedResponse(userRole, query, userName = 'Ji') {
  const lowerQuery = query.toLowerCase();
  const roleKnowledge = roleBasedKnowledge[userRole] || roleBasedKnowledge['trainee'];
  
  // Find matching knowledge
  let matchedResponse = null;
  
  if (lowerQuery.includes('dal makhani') || lowerQuery.includes('दाल मखनी')) {
    matchedResponse = roleKnowledge['dal makhani'];
  } else if (lowerQuery.includes('hygiene') || lowerQuery.includes('सफाई') || lowerQuery.includes('cleanliness')) {
    matchedResponse = roleKnowledge['hygiene'];
  } else if (lowerQuery.includes('training') || lowerQuery.includes('प्रशिक्षण') || lowerQuery.includes('सिखाना')) {
    matchedResponse = roleKnowledge['training'];
  }
  
  if (matchedResponse) {
    return `Namaste ${userName}! 🙏\n\n${matchedResponse.response}`;
  }
  
  // Default response with role-specific guidance
  return getRoleSpecificDefault(userRole, userName);
}

function getRoleSpecificDefault(userRole, userName) {
  const defaults = {
    chef: `Namaste Chef ${userName}! 👨‍🍳\n\nMain aapki help kar sakta hun:\n\n• **"dal makhani recipe"** - Complete cooking guide\n• **"hygiene rules"** - Kitchen safety standards\n• **"training"** - Team development guidance\n\nKya specific help chahiye?`,
    
    waiter: `Namaste ${userName}! 🍽️\n\nMain aapki service mein help kar sakta hun:\n\n• **"dal makhani"** - Guest ko kaise explain karein\n• **"hygiene"** - Service cleanliness standards\n• **"training"** - Customer service skills\n\nKya janna chahte hain?`,
    
    "delivery-boy": `Namaste ${userName}! 🚚\n\nDelivery ke liye guidance:\n\n• **"hygiene rules"** - Safe delivery protocols\n• **"training"** - Professional delivery skills\n• **"safety"** - Road safety guidelines\n\nKya help chahiye?`,
    
    supervisor: `Namaste ${userName}! 👥\n\nTeam management ke liye:\n\n• **"hygiene"** - Team monitoring guidelines\n• **"training"** - Leadership development\n• **"quality control"** - Standards maintenance\n\nKya guidance chahiye?`,
    
    trainee: `Namaste ${userName}! 🌱\n\nLearning ke liye available hai:\n\n• **"dal makhani"** - Basic dish knowledge\n• **"hygiene basics"** - Cleanliness fundamentals\n• **"training path"** - Your development journey\n\nKya seekhna chahte hain?`
  };
  
  return defaults[userRole] || defaults['trainee'];
}

module.exports = {
  roleBasedKnowledge,
  getRoleBasedResponse,
  getRoleSpecificDefault
};