// Файл: API/generate-macro.js
import { SYSTEM_PROMPT } from './prompt_data.js';

export const config = {
  runtime: 'edge', // Используем Edge для скорости
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { patientData } = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Нет ключа API' }), { status: 500 });
    }

    // ВАЖНОЕ ИЗМЕНЕНИЕ: используем gemini-1.5-flash (она быстрее)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `ВХОДНЫЕ ДАННЫЕ:\n${patientData}\n\nСгенерируй протокол строго по инструкции.` }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Проверяем, не вернул ли Google ошибку (например, 400 или 500)
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Google Error:", errorText);
        throw new Error(`Google API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error('Пустой ответ от модели.');
    }

    return new Response(JSON.stringify({ result: resultText }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
