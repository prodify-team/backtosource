// Simple test endpoint
export default function handler(req, res) {
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
  
  res.status(200).json({
    message: 'Back to Source API is working on Vercel!',
    timestamp: new Date().toISOString(),
    endpoints: {
      chat: 'POST /api/chat',
      test: 'GET /api/test'
    },
    status: 'healthy',
    version: '2.0'
  });
}