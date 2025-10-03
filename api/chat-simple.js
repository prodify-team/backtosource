module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { message = 'hello', userRole = 'trainee', userName = 'Ji' } = req.body || {};
  
  res.status(200).json({
    response: `Namaste ${userName}! 🙏\n\nYou said: "${message}"\nYour role: ${userRole}\n\nThis is working! Try:\n• "dal makhani recipe"\n• "hygiene rules"\n• "training"`,
    timestamp: new Date().toISOString(),
    userRole,
    userName,
    status: 'success'
  });
};