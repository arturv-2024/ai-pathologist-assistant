// Файл: API/generate-macro.js
// КОД-СКАНЕР: ПРОВЕРЯЕМ ДОСТУПНЫЕ МОДЕЛИ

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Вставь свой ключ (тот самый, новый) внутри кавычек:
  const apiKey = "AIzaSyANwXRki98C7w5ZaV7CoDToEs2biUKK_zE"; 

  // Спрашиваем у Google список всех доступных моделей
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    // Возвращаем чистый список, чтобы увидеть его на экране
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
