// Файл: API/generate-macro.js
// ИСПРАВЛЕННЫЙ СКАНЕР

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Твой ключ (для теста):
  const apiKey = "AIzaSyANwXRki98C7w5ZaV7CoDToEs2biUKK_zE"; 

  // Запрашиваем список моделей
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    // ВАЖНО: Превращаем ответ в текст и кладем в поле 'result',
    // чтобы твой сайт смог это отобразить.
    const debugText = JSON.stringify(data, null, 2);

    return new Response(JSON.stringify({ result: debugText }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
