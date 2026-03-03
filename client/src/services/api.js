const API_URL = 'http://localhost:5000/api/ai';

export const generateAIResponse = async (prompt, mode) => {
  const response = await fetch(`${API_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, mode }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};