#!/usr/bin/env node

// Sync Knowledge Base - Automatically sync files to database
// This script reads all files in ai-training/ and syncs them to Google Sheets

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const GoogleSheetsDB = require('./src/config/googleSheets');

async function syncKnowledgeBase() {
  console.log('🔄 Syncing Knowledge Base from files to database...');
  
  try {
    // Initialize Google Sheets
    await GoogleSheetsDB.initialize();
    
    const trainingPath = path.join(__dirname, '../ai-training');
    const categories = ['recipes', 'sops', 'training', 'locations', 'faqs'];
    
    let totalSynced = 0;
    
    for (const category of categories) {
      const categoryPath = path.join(trainingPath, category);
      
      if (!fs.existsSync(categoryPath)) {
        console.log(`⚠️  Category ${category} not found, skipping...`);
        continue;
      }
      
      const files = fs.readdirSync(categoryPath);
      console.log(`\n📁 Processing ${category} (${files.length} files):`);
      
      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        const fileName = path.parse(file).name;
        
        try {
          let content = '';
          let tags = [];
          
          if (file.endsWith('.md')) {
            content = fs.readFileSync(filePath, 'utf8');
            
            // Extract tags from filename
            tags = fileName.split('-').map(tag => tag.toLowerCase());
            
            // Add category-specific tags
            if (category === 'recipes') {
              tags.push('recipe', 'cooking', 'food');
            } else if (category === 'sops') {
              tags.push('sop', 'procedure', 'guidelines');
            } else if (category === 'training') {
              tags.push('training', 'learning', 'guide');
            } else if (category === 'locations') {
              tags.push('location', 'restaurant', 'info');
            }
            
          } else if (file.endsWith('.json')) {
            const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            content = JSON.stringify(jsonData, null, 2);
            tags = ['faq', 'questions', 'answers'];
          } else {
            console.log(`   ⏭️  Skipping ${file} (unsupported format)`);
            continue;
          }
          
          // Create knowledge document
          const docData = {
            title: fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            category: category,
            content: content,
            tags: tags,
            uploadedBy: 'auto-sync',
            source: `file:${category}/${file}`
          };
          
          await GoogleSheetsDB.createKnowledgeDocument(docData);
          console.log(`   ✅ Synced: ${docData.title}`);
          totalSynced++;
          
        } catch (error) {
          console.log(`   ❌ Error syncing ${file}: ${error.message}`);
        }
      }
    }
    
    console.log(`\n🎉 Sync completed! ${totalSynced} documents synced to knowledge base.`);
    
    // Generate summary
    console.log('\n📊 Knowledge Base Summary:');
    console.log('   📖 Recipes: Available for cooking guidance');
    console.log('   📋 SOPs: Standard operating procedures');
    console.log('   🎓 Training: Staff training materials');
    console.log('   📍 Locations: Restaurant-specific information');
    console.log('   ❓ FAQs: Common questions and answers');
    
    console.log('\n🤖 AI will now automatically use this knowledge for responses!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }
  
  process.exit(0);
}

// Auto-generate responses configuration
function generateResponseConfig() {
  console.log('\n🧠 Generating response configuration...');
  
  const trainingPath = path.join(__dirname, '../ai-training');
  const config = {
    autoResponses: {},
    keywords: {},
    categories: {}
  };
  
  const categories = ['recipes', 'sops', 'training', 'locations'];
  
  categories.forEach(category => {
    const categoryPath = path.join(trainingPath, category);
    
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath);
      config.categories[category] = [];
      
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const fileName = path.parse(file).name;
          const keywords = fileName.split('-');
          
          config.categories[category].push(fileName);
          config.keywords[fileName] = keywords;
          
          // Generate auto-response template
          config.autoResponses[fileName] = {
            hindi: `${fileName.replace(/-/g, ' ')} के बारे में जानकारी मिल गई। विस्तार से जानने के लिए पूछें।`,
            english: `Found information about ${fileName.replace(/-/g, ' ')}. Ask for more details.`,
            keywords: keywords,
            category: category
          };
        }
      });
    }
  });
  
  // Save configuration
  const configPath = path.join(__dirname, '../config/auto-responses.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  console.log(`✅ Response configuration saved to: ${configPath}`);
  console.log(`📝 Generated ${Object.keys(config.autoResponses).length} auto-responses`);
  
  return config;
}

// Run sync
syncKnowledgeBase().then(() => {
  generateResponseConfig();
});