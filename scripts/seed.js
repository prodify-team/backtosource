#!/usr/bin/env node

const { query } = require('../backend/src/config/database');

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');
  
  try {
    // Sample users for different restaurants
    const sampleUsers = [
      // Delhi CP
      { phone: '+919876543210', name: 'राजेश कुमार', role: 'restaurant-manager', location: 'delhi-cp' },
      { phone: '+919876543211', name: 'प्रिया शर्मा', role: 'head-chef', location: 'delhi-cp' },
      { phone: '+919876543212', name: 'अमित गुप्ता', role: 'waiter', location: 'delhi-cp' },
      { phone: '+919876543213', name: 'सुनीता देवी', role: 'chef', location: 'delhi-cp' },
      
      // Mumbai Bandra
      { phone: '+919876543214', name: 'विकास पटेल', role: 'restaurant-manager', location: 'mumbai-bandra' },
      { phone: '+919876543215', name: 'मीरा जोशी', role: 'head-chef', location: 'mumbai-bandra' },
      { phone: '+919876543216', name: 'राहुल मेहता', role: 'waiter', location: 'mumbai-bandra' },
      
      // Bangalore Koramangala
      { phone: '+919876543217', name: 'अर्जुन राव', role: 'restaurant-manager', location: 'bangalore-koramangala' },
      { phone: '+919876543218', name: 'लक्ष्मी नायर', role: 'head-chef', location: 'bangalore-koramangala' },
      
      // Owner/Regional Manager
      { phone: '+919876543219', name: 'संजय अग्रवाल', role: 'owner', location: 'delhi-cp' },
      { phone: '+919876543220', name: 'अनिता सिंह', role: 'regional-manager', location: 'mumbai-bandra' }
    ];
    
    console.log('👥 Creating sample users...');
    for (const user of sampleUsers) {
      try {
        await query(`
          INSERT INTO users (phone, name, role, location, preferred_language)
          VALUES ($1, $2, $3, $4, 'hindi')
          ON CONFLICT (phone) DO NOTHING
        `, [user.phone, user.name, user.role, user.location]);
      } catch (error) {
        console.log(`   ⚠️  User ${user.name} might already exist`);
      }
    }
    
    // Get user IDs for task creation
    const usersResult = await query('SELECT id, name, role, location FROM users');
    const users = usersResult.rows;
    
    // Sample knowledge documents
    const sampleDocs = [
      {
        title: 'Dal Makhani Recipe - Signature Dish',
        category: 'recipes',
        content: `Dal Makhani - Back to Source Signature Recipe

Ingredients (Serves 6-8):
- काली दाल (Black Lentils): 1.5 cups
- राजमा (Kidney Beans): 1/2 cup
- मक्खन (Butter): 6 tbsp
- क्रीम (Heavy Cream): 3/4 cup
- अदरक-लहसुन पेस्ट: 3 tbsp
- टमाटर प्यूरी: 1.5 cups
- प्याज (finely chopped): 2 medium
- गरम मसाला: 1.5 tsp
- लाल मिर्च पाउडर: 1 tsp
- नमक: स्वादानुसार

Cooking Method:
1. Preparation (45 minutes):
   - दाल और राजमा को 8-10 घंटे भिगोएं
   - Pressure cooker में 5-6 whistles तक उबालें
   - दाल को हल्का मैश करें (chunky texture रखें)

2. Base Preparation (25 minutes):
   - Heavy bottom pan में मक्खन गर्म करें
   - प्याज को golden brown तक भूनें (8-10 मिनट)
   - अदरक-लहसुन पेस्ट डालें, 3 मिनट भूनें
   - टमाटर प्यूरी डालें, 12-15 मिनट पकाएं

3. Slow Cooking (4-6 hours) - MOST IMPORTANT:
   - उबली हुई दाल को base में मिलाएं
   - धीमी आंच पर 4-6 घंटे पकाएं
   - हर 30 मिनट में हिलाते रहें
   - CRITICAL: तेज आंच पर बिल्कुल नहीं पकाना

4. Finishing (15 minutes):
   - क्रीम डालें और 5 मिनट पकाएं
   - गरम मसाला और नमक डालें
   - 3 tbsp मक्खन डालकर serve करें

Chef's Secret Tips:
- Authentic taste के लिए minimum 4 घंटे slow cooking जरूरी
- Consistency थोड़ी thick होनी चाहिए, पतली नहीं
- Fresh cream और chopped coriander से garnish करें
- अगले दिन taste और भी बेहतर होता है

Timing for Service:
- Lunch prep: सुबह 7 बजे शुरू करें
- Dinner prep: दोपहर 11 बजे शुरू करें
- Always keep ready: यह हमारी signature dish है

Common Problems & Solutions:
- Dal फट रही है: आंच तेज है, धीमी करें
- Taste bland है: नमक और गरम मसाला बढ़ाएं
- Too thick: गर्म पानी या stock डालें
- Too thin: और 45 मिनट पकाएं`,
        tags: ['dal', 'makhani', 'signature', 'recipe', 'slow-cooking'],
        uploadedById: 1
      },
      {
        title: 'Kitchen Hygiene Standards - Daily SOP',
        category: 'sops',
        content: `Kitchen Hygiene SOP - Back to Source

DAILY HYGIENE CHECKLIST:

Before Starting Work (Mandatory):
□ हाथ धोना (Hand washing) - 20 seconds with soap
□ Clean apron और hair net पहनना
□ Nails clean और trimmed (no nail polish)
□ कोई jewelry नहीं (wedding ring allowed)
□ Fresh breath check (no strong odors)

During Cooking Operations:
□ हर ingredient change पर हाथ धोना
□ Raw और cooked food अलग cutting boards
□ Different knives for veg/non-veg
□ Tasting spoon को दोबारा use नहीं करना
□ Work surface को हर task के बाद sanitize करना

Food Storage Temperature Guidelines:
- Cold Storage: 4°C या कम (check hourly)
- Freezer: -18°C (check twice daily)
- Hot Food Service: 65°C से ऊपर
- DANGER ZONE: 5°C से 60°C (avoid at all costs)

Cleaning Schedule:

Every 2 Hours:
□ Hand washing stations refill
□ Dustbins empty करना
□ Floor mopping (if needed)
□ Equipment sanitization

End of Day (Mandatory):
□ All equipment deep clean
□ Refrigerator temperature log
□ Waste disposal properly
□ Kitchen floor और walls sanitize
□ Final inspection by head chef

FOOD SAFETY VIOLATIONS:
- First Warning: Verbal counseling + retraining
- Second Warning: Written warning + 1 day suspension
- Third Warning: Final warning + 3 day suspension
- Serious Violation: Immediate termination

Emergency Procedures:
If someone gets sick:
1. तुरंत kitchen से बाहर भेजना
2. Manager को immediately inform करना
3. Work area को deep sanitize करना
4. Incident report में entry करना

Remember: Customer health हमारी सबसे बड़ी जिम्मेदारी है!`,
        tags: ['hygiene', 'safety', 'kitchen', 'sop', 'daily'],
        uploadedById: 1
      },
      {
        title: 'Customer Service Excellence Training',
        category: 'training',
        content: `Customer Service Training - Back to Source

GREETING STANDARDS:
- Hindi: "नमस्ते! Back to Source में आपका स्वागत है"
- English: "Welcome to Back to Source! How may I help you today?"
- Smile और eye contact जरूरी
- 2 मिनट के अंदर table approach करना

MENU KNOWLEDGE (Must Know):
1. Dal Makhani - 4-6 hours slow cooked signature dish
2. Butter Chicken - Creamy tomato-based curry
3. Biryani - Aromatic basmati rice preparation
4. Fresh Naan - Made in tandoor

UPSELLING TECHNIQUES:
- "Would you like to try our signature Dal Makhani?"
- "Fresh naan goes perfectly with your curry"
- "Our lassi is made fresh with organic yogurt"
- "Today's special is our chef's recommendation"

HANDLING COMPLAINTS (LEARN Protocol):
L - Listen completely without interrupting
E - Empathize: "I understand your concern"
A - Apologize: "I'm sorry for the inconvenience"
R - Resolve: Offer immediate solution
N - Note: Record for future prevention

COMMON SITUATIONS:

Long Wait Times:
- Inform customer every 10 minutes
- Offer complimentary papad/salad
- Give realistic time estimates
- Manager involvement if >30 minutes

Wrong Order:
- Apologize immediately
- Replace without charge
- Offer dessert as compensation
- Ensure correct order priority

Payment Issues:
- Stay calm and professional
- Call manager immediately
- Never argue about prices
- Offer to explain bill clearly

SERVICE RECOVERY:
- Complimentary appetizer for delays >20 minutes
- Manager's personal apology for major issues
- 10% discount for service failures
- Follow-up call next day for serious complaints

REMEMBER: Every customer is family. Treat them with respect and care.`,
        tags: ['customer-service', 'training', 'hospitality', 'standards'],
        uploadedById: 1
      }
    ];
    
    console.log('📚 Creating sample knowledge documents...');
    for (const doc of sampleDocs) {
      try {
        await query(`
          INSERT INTO knowledge_documents (title, category, content, tags, uploaded_by_id)
          VALUES ($1, $2, $3, $4, $5)
        `, [doc.title, doc.category, doc.content, doc.tags, doc.uploadedById]);
      } catch (error) {
        console.log(`   ⚠️  Document ${doc.title} might already exist`);
      }
    }
    
    // Sample tasks
    const managers = users.filter(u => u.role.includes('manager') || u.role === 'owner');
    const staff = users.filter(u => !u.role.includes('manager') && u.role !== 'owner');
    
    if (managers.length > 0 && staff.length > 0) {
      const sampleTasks = [
        {
          title: 'दाल मखनी तैयार करें - Evening Service',
          description: 'शाम की service के लिए दाल मखनी बनाएं। 4-6 घंटे slow cooking required। 5 PM तक ready होना चाहिए।',
          assignedToId: staff.find(u => u.role === 'chef' || u.role === 'head-chef')?.id,
          assignedById: managers[0].id,
          priority: 'high',
          tags: ['cooking', 'signature-dish', 'evening-prep']
        },
        {
          title: 'Table Setup और Cleaning',
          description: 'सभी tables को properly set करें और sanitize करें। Fresh flowers और clean napkins check करें।',
          assignedToId: staff.find(u => u.role === 'waiter')?.id,
          assignedById: managers[0].id,
          priority: 'medium',
          tags: ['cleaning', 'setup', 'service-prep']
        },
        {
          title: 'Inventory Check - Spices और Vegetables',
          description: 'Kitchen inventory check करें। कल के लिए जो भी चाहिए उसकी list बनाएं। Stock levels update करें।',
          assignedToId: staff.find(u => u.role === 'head-chef')?.id,
          assignedById: managers[0].id,
          priority: 'high',
          tags: ['inventory', 'planning', 'supplies']
        }
      ];
      
      console.log('📋 Creating sample tasks...');
      for (const task of sampleTasks) {
        if (task.assignedToId) {
          try {
            await query(`
              INSERT INTO tasks (title, description, assigned_to_id, assigned_by_id, priority, tags)
              VALUES ($1, $2, $3, $4, $5, $6)
            `, [task.title, task.description, task.assignedToId, task.assignedById, task.priority, task.tags]);
          } catch (error) {
            console.log(`   ⚠️  Task ${task.title} creation failed`);
          }
        }
      }
    }
    
    // Show final stats
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM restaurants) as restaurants,
        (SELECT COUNT(*) FROM knowledge_documents) as documents,
        (SELECT COUNT(*) FROM tasks) as tasks
    `);
    
    console.log('\n📊 Database seeded successfully!');
    console.log('📈 Final counts:');
    console.log(`   👥 Users: ${stats.rows[0].users}`);
    console.log(`   🏪 Restaurants: ${stats.rows[0].restaurants}`);
    console.log(`   📚 Knowledge Documents: ${stats.rows[0].documents}`);
    console.log(`   📋 Tasks: ${stats.rows[0].tasks}`);
    
    console.log('\n🧪 Test Login Credentials:');
    console.log('   📱 Phone: +919876543210 (राजेश कुमार - Manager)');
    console.log('   📱 Phone: +919876543211 (प्रिया शर्मा - Head Chef)');
    console.log('   📱 Phone: +919876543219 (संजय अग्रवाल - Owner)');
    console.log('   🔐 OTP: 123456 (demo)');
    
    console.log('\n🎉 Ready to test your Back to Source system!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

seedDatabase();