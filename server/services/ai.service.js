const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const callGeminiAI = async (structuredPrompt) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(structuredPrompt);
  const text = result.response.text();
  if (!text) throw new Error('Empty response from Gemini.');
  return text.trim();
};
module.exports = { callGeminiAI };
