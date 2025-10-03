// Simple chat API for Vercel
module.exports = async (req, res) => {
  // Enable CORS with proper headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, userRole, userName } = req.body;
    
    console.log(`🔍 Processing: "${message}" for role: ${userRole}" - v2.1`);
    
    const finalUserName = userName || 'Ji';
    const finalUserRole = userRole || 'trainee';
    
    // Simple role-based responses (inline to avoid module issues)
    const response = getSimpleResponse(message, finalUserRole, finalUserName);
    
    console.log(`✅ Response generated for ${finalUserRole}`);
    
    res.status(200).json({
      response: response,
      timestamp: new Date().toISOString(),
      userRole: finalUserRole,
      userName: finalUserName
    });
    
  } catch (error) {
    console.error('🚨 API Error:', error.message);
    
    const userName = req.body?.userName || 'Ji';
    const fallbackResponse = `Sorry ${userName}! 🙏\n\nTechnical issue hai. Please try:\n• "dal makhani recipe"\n• "hygiene rules"\n• "training"\n\nDaily Tip: Patience se sab kuch theek ho jayega! ✨`;
    
    res.status(200).json({
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      error: 'fallback'
    });
  }
};

function getSimpleResponse(message, userRole, userName) {
  const lowerMessage = message.toLowerCase();
  
  // Dal Makhani responses
  if (lowerMessage.includes('dal makhani') || lowerMessage.includes('दाल मखनी') || lowerMessage.includes('recipe')) {
    if (userRole === 'chef') {
      return `Namaste Chef ${userName}! 👨‍🍳

🍛 **Dal Makhani - Chef Level Recipe**

• **Ingredients:** काली दाल 1 cup, राजमा 1/4 cup, मक्खन 4 tbsp, क्रीम 1/2 cup

• **Chef Method:**
  - 8 hours soaking zaroori hai
  - Pressure cook 4-5 whistles with salt
  - Slow cook 4-6 hours on low flame
  - Tempering: cumin, onions, tomatoes
  - Final touch: cream और butter

• **Wrong Way:** Fast cooking या microwave mein banana
• **Right Way:** Traditional slow cooking with patience

• **Chef Assignment:** Practice temperature control aur timing perfect kariye

• **Daily Tip:** Authentic taste ke liye dhimi aanch pe sabr rakhiye! 🔥`;
    } else if (userRole === 'waiter') {
      return `Namaste ${userName}! 🍽️

🍛 **Dal Makhani - Service Knowledge**

• **Description:** "Our signature slow-cooked black lentils with butter and cream"
• **Cooking Time:** 6+ hours slow cooking process
• **Serving Style:** Hot, garnished with cream swirl
• **Pairing:** Butter Naan, Jeera Rice, Tandoori Roti
• **Allergens:** Contains dairy (butter, cream)

• **Wrong Way:** "It's just dal" kehna guests ko
• **Right Way:** Passionate description with cooking details

• **Assignment:** 5 guests ko dal makhani ki story batayiye

• **Daily Tip:** Food ki story batane se guests impressed hote hain! ✨`;
    } else {
      return `Namaste ${userName}! 📚

🍛 **Dal Makhani - Learning Basics**

• **What is it:** Our signature dish - black lentils cooked very slowly
• **Key Points:**
  - Takes 6+ hours to cook properly
  - Made with black lentils and kidney beans
  - Very creamy and rich taste
  - Served hot with bread or rice

• **Why Special:** Long cooking time makes it very special and tasty

• **Assignment:** 3 experienced staff se dal makhani के बारे में और details सीखिए

• **Daily Tip:** हर दिन कुछ नया सीखने की कोशिश करिए! 📖`;
    }
  }
  
  // Hygiene responses
  else if (lowerMessage.includes('hygiene') || lowerMessage.includes('सफाई') || lowerMessage.includes('cleanliness')) {
    if (userRole === 'chef') {
      return `Namaste Chef ${userName}! 🧼

🧼 **Kitchen Hygiene - Chef Standards**

• **Hand Protocol:** 20 seconds soap wash before every task
• **Uniform:** Clean apron daily, hair net mandatory, closed shoes
• **Food Safety:** Raw-cooked separation, FIFO rotation strict
• **Temperature Control:** Cold storage 4°C, hot holding 65°C+
• **Equipment:** Daily sanitization of all tools and surfaces

• **Wrong Way:** Dirty hands se food handle karna
• **Right Way:** Every step mein cleanliness maintain karna

• **Assignment:** Team ko hygiene training diye aur daily checklist implement kariye

• **Daily Tip:** Kitchen ki cleanliness restaurant ki reputation hai! 🏆`;
    } else if (userRole === 'waiter') {
      return `Namaste ${userName}! 🧽

🧼 **Service Hygiene Standards**

• **Personal Hygiene:** Clean uniform, trimmed nails, fresh breath
• **Hand Sanitization:** Before serving, between tables, after cleaning
• **Table Service:** Clean serving tools, proper plate handling
• **Dining Area:** Clean tables, chairs, floor maintenance
• **Guest Safety:** Hand sanitizer available, maintain cleanliness

• **Wrong Way:** Dirty uniform mein guests ko serve karna
• **Right Way:** Impeccable presentation aur thorough cleaning

• **Assignment:** Today 10 tables ko perfect hygiene standards se serve kariye

• **Daily Tip:** Aapki cleanliness restaurant ka first impression hai! 👔`;
    } else {
      return `Namaste ${userName}! 🎓

🧼 **Hygiene Basics for You**

• **Personal Hygiene:** Daily bath, clean clothes, trimmed nails
• **Hand Washing:** 20 seconds with soap, before every task
• **Food Safety:** Don't touch food directly, use gloves/tools
• **Workspace:** Keep your area clean and organized
• **Questions:** When in doubt, ask supervisor

• **Wrong Way:** Hygiene rules ko ignore karna
• **Right Way:** Every rule ko seriously follow karna

• **Assignment:** Hygiene checklist banayiye aur daily follow kariye

• **Daily Tip:** Good habits शुरू से ही बनाइए! ✨`;
    }
  }
  
  // Training responses
  else if (lowerMessage.includes('training') || lowerMessage.includes('प्रशिक्षण') || lowerMessage.includes('learn')) {
    if (userRole === 'chef') {
      return `Namaste Chef ${userName}! 🎓

👨‍🍳 **Chef Training Program**

• **Advanced Modules:** Cooking techniques, Kitchen management, Food safety, Recipe development
• **Leadership Skills:** Team training, Quality control, Mentoring junior chefs
• **Responsibilities:** Maintain standards, Train staff, Ensure compliance

• **Wrong Way:** Bina proper training ke team ko guide karna
• **Right Way:** Systematic training approach aur continuous development

• **Assignment:** 1 junior chef ko mentor kariye this week

• **Daily Tip:** Great chefs create more great chefs! 🌟`;
    } else if (userRole === 'waiter') {
      return `Namaste ${userName}! 🎯

🍽️ **Waiter Training Program**

• **Service Excellence:** Customer service, Menu knowledge, Upselling techniques
• **Skills:** Order management, Complaint handling, Table management
• **Communication:** Professional etiquette, Cultural sensitivity

• **Wrong Way:** Guests ko ignore karna या menu knowledge lack
• **Right Way:** Proactive service aur complete product knowledge

• **Assignment:** 3 new menu items ke complete details learn kariye

• **Daily Tip:** Smile aapka best accessory hai! 😊`;
    } else {
      return `Namaste ${userName}! 🌱

🎓 **Your Training Journey**

• **Learning Path:**
  - Week 1-2: Company culture, basic safety
  - Week 3-4: Role-specific skills
  - Week 5-6: Advanced techniques
  - Ongoing: Continuous learning

• **Support:** Assigned mentor, Regular feedback, Hands-on training

• **Wrong Way:** Jaldi mein sab kuch seekhne ki koshish
• **Right Way:** Step by step learning with patience

• **Assignment:** Apne mentor se daily 1 new skill seekhiye

• **Daily Tip:** Patience aur practice se perfection aati hai! 🚀`;
    }
  }
  
  // Default response
  else {
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