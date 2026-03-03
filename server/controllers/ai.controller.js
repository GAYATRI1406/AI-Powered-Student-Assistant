const { callGeminiAI } = require('../services/ai.service');
const { buildPrompt } = require('../services/prompt.service');
const VALID_MODES = ['explain', 'mcq', 'summarize', 'improve'];
const generateResponse = async (req, res) => {
  try {
    const { prompt, mode } = req.body;
    if (!prompt || prompt.trim() === '') return res.status(400).json({ error: 'Prompt is required.' });
    if (!mode || !VALID_MODES.includes(mode)) return res.status(400).json({ error: 'Invalid mode.' });
    const structuredPrompt = buildPrompt(prompt.trim(), mode);
    const aiResponse = await callGeminiAI(structuredPrompt);
    return res.status(200).json({ success: true, mode, response: aiResponse });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = { generateResponse };
