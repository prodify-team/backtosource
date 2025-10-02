#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

const GoogleSheetsDB = require('./src/config/googleSheets');

async function setupGoogleSheets() {
  console.log('📊 Setting up Google Sheets database...');
  
  try {
    // Initialize Google Sheets
    await GoogleSheetsDB.initialize();
    
    // Check health
    const health = await GoogleSheetsDB.healthCheck();
    console.log('📋 Health Check:', health);
    
    if (health.status === 'connected') {
      console.log('✅ Google Sheets connected successfully!');
      console.log(`📄 Sheet Title: ${health.sheetTitle}`);
      console.log(`📊 Sheets Created: ${health.sheetsCount}`);
      
      // Add sample data
      console.log('\n🌱 Adding sample data...');
      
      // Sample restaurants (these will be added to the sheet)
      const sampleRestaurants = [
        { name: 'Back to Source - Connaught Place', locationCode: 'delhi-cp', address: 'Block A, Connaught Place', city: 'New Delhi', state: 'Delhi', manager: 'राजेश कुमार', phone: '+91-11-4567-8901', isActive: 'true' },
        { name: 'Back to Source - Bandra', locationCode: 'mumbai-bandra', address: 'Linking Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', manager: 'विकास पटेल', phone: '+91-22-4567-8903', isActive: 'true' },
        { name: 'Back to Source - Koramangala', locationCode: 'bangalore-koramangala', address: '5th Block, Koramangala', city: 'Bangalore', state: 'Karnataka', manager: 'अर्जुन राव', phone: '+91-80-4567-8905', isActive: 'true' }
      ];
      
      // Sample users
      const sampleUsers = [
        { phone: '+919876543210', name: 'राजेश कुमार', role: 'restaurant-manager', location: 'delhi-cp', preferredLanguage: 'hindi' },
        { phone: '+919876543211', name: 'प्रिया शर्मा', role: 'head-chef', location: 'delhi-cp', preferredLanguage: 'hindi' },
        { phone: '+919876543212', name: 'अमित गुप्ता', role: 'waiter', location: 'delhi-cp', preferredLanguage: 'hindi' },
        { phone: '+919876543219', name: 'संजय अग्रवाल', role: 'owner', location: 'delhi-cp', preferredLanguage: 'hindi' }
      ];
      
      // Add sample users
      for (const userData of sampleUsers) {
        try {
          await GoogleSheetsDB.createUser(userData);
          console.log(`👤 Added user: ${userData.name}`);
        } catch (error) {
          console.log(`   ⚠️  User ${userData.name} might already exist`);
        }
      }
      
      // Sample knowledge documents
      const sampleDocs = [
        {
          title: 'Dal Makhani Recipe - Signature',
          category: 'recipes',
          content: 'Dal Makhani - Back to Source Signature. Ingredients: काली दाल 1 cup, राजमा 1/4 cup, मक्खन 4 tbsp, क्रीम 1/2 cup. Method: 1) Soak 8 hours 2) Pressure cook 4-5 whistles 3) Slow cook 4-6 hours 4) Add cream and butter. Important: धीमी आंच पर पकाना जरूरी है।',
          tags: 'dal,makhani,signature,recipe',
          uploadedBy: 'admin'
        },
        {
          title: 'Kitchen Hygiene Standards',
          category: 'sops',
          content: 'Daily Hygiene SOP: 1) हाथ धोना 20 seconds soap से 2) Clean apron और hair net 3) No jewelry except wedding ring 4) Temperature checks: Cold 4°C, Hot 65°C+ 5) Raw और cooked food separate 6) FIFO principle 7) Equipment sanitization',
          tags: 'hygiene,safety,kitchen,sop',
          uploadedBy: 'admin'
        }
      ];
      
      // Add sample knowledge documents
      for (const doc of sampleDocs) {
        try {
          await GoogleSheetsDB.createKnowledgeDocument(doc);
          console.log(`📚 Added document: ${doc.title}`);
        } catch (error) {
          console.log(`   ⚠️  Document ${doc.title} might already exist`);
        }
      }
      
      // Sample tasks
      const sampleTasks = [
        {
          title: 'दाल मखनी तैयार करें - Evening Service',
          description: 'शाम की service के लिए दाल मखनी बनाएं। 4-6 घंटे slow cooking required।',
          assignedTo: 'प्रिया शर्मा',
          assignedBy: 'राजेश कुमार',
          role: 'chef',
          priority: 'high'
        },
        {
          title: 'Table Setup और Cleaning',
          description: 'सभी tables को properly set करें और sanitize करें।',
          assignedTo: 'अमित गुप्ता',
          assignedBy: 'राजेश कुमार',
          role: 'waiter',
          priority: 'medium'
        }
      ];
      
      // Add sample tasks
      for (const task of sampleTasks) {
        try {
          await GoogleSheetsDB.createTask(task);
          console.log(`📋 Added task: ${task.title}`);
        } catch (error) {
          console.log(`   ⚠️  Task ${task.title} might already exist`);
        }
      }
      
      console.log('\n🎉 Google Sheets setup completed successfully!');
      console.log('\n📊 Your data is now available in Google Sheets:');
      console.log('   👥 Users sheet - Staff information');
      console.log('   📋 Tasks sheet - Task assignments and status');
      console.log('   📚 KnowledgeBase sheet - Recipes and SOPs');
      console.log('   💬 Conversations sheet - Chat analytics');
      console.log('   🏪 Restaurants sheet - Location information');
      
      console.log('\n🧪 Test Login Credentials:');
      console.log('   📱 Phone: +919876543210 (राजेश कुमार - Manager)');
      console.log('   📱 Phone: +919876543211 (प्रिया शर्मा - Head Chef)');
      console.log('   📱 Phone: +919876543219 (संजय अग्रवाल - Owner)');
      console.log('   🔐 OTP: 123456 (demo)');
      
    } else {
      console.log('⚠️  Google Sheets not configured - running in local mode');
      console.log('📝 To enable Google Sheets:');
      console.log('   1. Follow setup guide: deployment/google-sheets-setup.md');
      console.log('   2. Add GOOGLE_SHEET_ID to .env file');
      console.log('   3. Add service account credentials');
      console.log('   4. Run this script again');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your .env file has GOOGLE_SHEET_ID');
    console.log('   2. Verify service account credentials');
    console.log('   3. Ensure sheet is shared with service account email');
    console.log('   4. Check Google Sheets API is enabled');
  }
  
  process.exit(0);
}

setupGoogleSheets();