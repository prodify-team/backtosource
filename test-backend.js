// Simple test to check if OpenAI API key works
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testAI() {
  try {
    console.log('Testing OpenAI connection...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful Hindi-speaking restaurant assistant." },
        { role: "user", content: "दाल मखनी कैसे बनाएं?" }
      ],
      max_tokens: 200,
    });

    console.log('✅ OpenAI working!');
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ OpenAI Error:', error.message);
  }
}

testAI();