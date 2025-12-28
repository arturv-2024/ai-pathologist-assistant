// Файл: API/generate-macro.js
import { SYSTEM_PROMPT } from './prompt_data.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { patientData } = await req.json();
    
    // Получаем ключ из настроек Vercel
    const apiKey = process.env.GOOGLE_API_KEY; 

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Не настроен API ключ (GOOGLE_API_KEY)' }), { status: 500 });
    }

    // Адрес API Gemini 1.5 Pro
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `ВОТ ВХОДНЫЕ ДАННЫЕ (ЭПИКРИЗ, МАКРО, МИКРО):\n\n${patientData}\n\nСгенерируй протокол строго по инструкции.` }]
        }
      ],
      generationConfig: {
        temperature: 0.2, // Строгость
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Ошибка API Google');
    }

    // Достаем текст ответа
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error('Пустой ответ от Gemini. Возможно, сработал фильтр безопасности.');
    }

    return new Response(JSON.stringify({ result: resultText }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
