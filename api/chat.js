// Vercel serverless function for chat API
const knowledgeLoader = require('../backend/knowledge/knowledgeLoader');

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, userRole, userName } = req.body;
    
    console.log(`🔍 Processing: "${message}" for role: ${userRole}`);
    
    const finalUserName = userName || 'Ji';
    const finalUserRole = userRole || 'trainee';
    
    // Find relevant content from file-based knowledge system
    const relevantContent = knowledgeLoader.findRelevantContent(message, finalUserRole);
    
    // Generate response using structured knowledge
    const response = knowledgeLoader.generateResponse(message, finalUserRole, finalUserName, relevantContent);
    
    console.log(`✅ File-based knowledge response generated for ${finalUserRole}`);
    
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
}