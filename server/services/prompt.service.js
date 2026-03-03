const buildPrompt = (userInput, mode) => {
  switch (mode) {
    case 'explain':
      return `You are an experienced university instructor. Explain the following concept to a beginner student. Use simple language. Keep the explanation under 150 words. If you are not sure, say so.\n\nConcept: ${userInput}`;
    case 'mcq':
      return `You are an exam question designer. Generate exactly 3 MCQs based on the topic below. Return ONLY valid JSON in this format: {"questions":[{"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct_answer":"A","explanation":"..."}]}\n\nTopic: ${userInput}`;
    case 'summarize':
      return `You are a content editor. Summarize the following text in 50-100 words. Only use information from the text provided.\n\nText: ${userInput}`;
    case 'improve':
      return `You are a writing coach. Improve the grammar, clarity and flow of the following text. Do not change the original meaning.\n\nText: ${userInput}`;
    default:
      throw new Error('Unknown mode');
  }
};
module.exports = { buildPrompt };
