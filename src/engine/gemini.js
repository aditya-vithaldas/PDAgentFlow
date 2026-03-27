const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-3-flash-preview';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export async function callGemini(systemPrompt, userPrompt) {
  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 1024 },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${err}`);
  }

  const data = await res.json();

  // Gemini 3 Flash (thinking model) may return multiple parts — find the text part
  const parts = data.candidates?.[0]?.content?.parts || [];
  const textPart = parts.find((p) => p.text && !p.thoughtSignature);
  return textPart?.text || parts[0]?.text || '';
}
