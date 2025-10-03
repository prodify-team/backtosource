// Vercel test endpoint
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({
    message: 'Back to Source API is working on Vercel!',
    timestamp: new Date().toISOString(),
    endpoints: {
      chat: 'POST /api/chat',
      test: 'GET /api/test'
    },
    status: 'healthy'
  });
}