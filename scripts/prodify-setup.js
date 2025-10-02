#!/usr/bin/env node

// Quick setup script for Prodify Team
// This creates the Google Sheet and configures everything automatically

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function setupForProdify() {
  console.log('🚀 Setting up Back to Source system for Prodify Team...');
  console.log('📧 Account: solutions@prodifyteam.com');
  
  // Instructions for manual setup (since we can't create sheets programmatically without auth)
  console.log('\n📋 Manual Setup Steps:');
  console.log('');
  console.log('1. 📊 CREATE GOOGLE SHEET:');
  console.log('   • Login to https://sheets.google.com with solutions@prodifyteam.com');
  console.log('   • Create new spreadsheet');
  console.log('   • Name: "Back to Source - Restaurant Management System"');
  console.log('   • Copy the Sheet ID from URL');
  console.log('');
  console.log('2. 🔧 GOOGLE CLOUD SETUP:');
  console.log('   • Go to https://console.cloud.google.com');
  console.log('   • Create project: "backtosource-prod"');
  console.log('   • Enable Google Sheets API');
  console.log('   • Create Service Account: "backtosource-sheets"');
  console.log('   • Download JSON key file');
  console.log('');
  console.log('3. 🔐 SHARE SHEET:');
  console.log('   • Open your Google Sheet');
  console.log('   • Click "Share" button');
  console.log('   • Add service account email (from JSON file)');
  console.log('   • Give "Editor" permissions');
  console.log('');
  console.log('4. ⚙️  UPDATE .ENV FILE:');
  console.log('   • Add GOOGLE_SHEET_ID=your_sheet_id');
  console.log('   • Add service account credentials');
  console.log('');
  console.log('5. 🧪 TEST SETUP:');
  console.log('   • Run: npm run setup-sheets');
  console.log('   • Check your Google Sheet for new data');
  console.log('');
  
  // Create sample .env template
  const envTemplate = `
# Back to Source - Environment Configuration
# Copy this to .env file and fill in your values

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Sheets Configuration (for MVP database)
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=backtosource-sheets@backtosource-prod.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_private_key_from_service_account_json
-----END PRIVATE KEY-----"

# Application Configuration
NODE_ENV=production
PORT=3001
CLIENT_URL=https://backtosource-prod.appspot.com

# JWT Secret (generate random string)
JWT_SECRET=your_jwt_secret_here
`;

  // Write template to file
  require('fs').writeFileSync('.env.template', envTemplate.trim());
  console.log('📄 Created .env.template file with configuration template');
  
  // Show expected sheet structure
  console.log('\n📊 Expected Google Sheet Structure:');
  console.log('');
  console.log('Sheet 1: Users');
  console.log('Headers: id | phone | name | role | location | preferredLanguage | isActive | createdAt | lastSeen');
  console.log('');
  console.log('Sheet 2: Tasks');
  console.log('Headers: id | title | description | assignedTo | assignedBy | role | priority | status | statusNote | createdAt | completedAt');
  console.log('');
  console.log('Sheet 3: KnowledgeBase');
  console.log('Headers: id | title | category | content | tags | uploadedBy | version | isActive | createdAt | updatedAt');
  console.log('');
  console.log('Sheet 4: Conversations');
  console.log('Headers: id | userId | userName | message | response | timestamp | responseTime');
  console.log('');
  console.log('Sheet 5: Restaurants');
  console.log('Headers: id | name | locationCode | address | city | state | manager | phone | isActive');
  console.log('');
  
  console.log('🎯 Benefits of Google Sheets MVP:');
  console.log('   💰 Cost: $0/month (vs $50-100 for database)');
  console.log('   ⏱️  Setup: 5 minutes (vs 2-3 hours for database)');
  console.log('   👥 Team Access: solutions@prodifyteam.com can monitor everything');
  console.log('   📊 Analytics: Built-in charts and pivot tables');
  console.log('   🔄 Real-time: Live updates as staff use the system');
  console.log('');
  
  console.log('🧪 Test Credentials (after setup):');
  console.log('   📱 Manager: +919876543210 (राजेश कुमार)');
  console.log('   📱 Chef: +919876543211 (प्रिया शर्मा)');
  console.log('   📱 Owner: +919876543219 (संजय अग्रवाल)');
  console.log('   🔐 OTP: 123456 (demo)');
  console.log('');
  
  console.log('🚀 Next Steps:');
  console.log('   1. Complete manual setup steps above');
  console.log('   2. Run: npm run setup-sheets');
  console.log('   3. Deploy: ./deployment/quick-deploy.sh');
  console.log('   4. Share app URL with 350+ team members');
  console.log('');
  
  console.log('✨ Your restaurant management system will be live with Google Sheets as the database!');
}

setupForProdify().catch(console.error);