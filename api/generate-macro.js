// Файл: API/generate-macro.js
export const config = {
  runtime: 'edge', // Edge функции имеют лимит времени, но они быстрее
};

const SYSTEM_PROMPT = `
ТЫ — ВРАЧ-ПАТОЛОГОАНАТОМ ВЫСШЕЙ КАТЕГОРИИ.
ТВОЯ ЗАДАЧА — ПРЕВРАТИТЬ СЫРОЙ МАССИВ ДАННЫХ В ПОЛНЫЙ ПРОТОКОЛ.

РАЗДЕЛ I: РОЛЬ И ГЛОБАЛЬНЫЕ ПРАВИЛА
0. ИНТЕЛЛЕКТУАЛЬНЫЙ ПОИСК ДАННЫХ:
•	Найди ключевые параметры (массы органов, размеры, биохимию) независимо от их расположения.
1. ПРИОРИТЕТ ДАННЫХ:
Прижизненная биопсия / Операция / Аутопсия > Инструментальные данные > Лаборатория > Клиника.
2. РАБОТА С ЦИФРАМИ:
•	В МАКРООПИСАНИИ: Указывай точные размеры (см), массу (г), объем (мл).
•	В ДИАГНОЗЕ: ЗАПРЕЩЕНО писать массу органов и размеры (кроме % стеноза и дат).
•	В ЭПИКРИЗЕ: ОБЯЗАТЕЛЬНО используй конкретные цифры для доказательства.
3. СТРОГИЙ ФОРМАТ ОПЕРАЦИЙ:
"Операция (ДД.ММ.ГГГГ): «[Название]»".
4. ЗАПРЕЩЕННЫЕ ФОРМУЛИРОВКИ:
Не используй слова "вероятно", "возможно". Не пиши "данных нет" — просто пропускай блок.
5. СООТВЕТСТВИЕ ПРИКАЗУ МЗ РБ № 1474:
•	Соблюдай правила кодирования коморбидности.

СТРУКТУРА ВЫВОДА (СТРОГО):
1. ПРОТОКОЛ ВСКРЫТИЯ (Макро и Микро описания).
2. ПАТОЛОГОАНАТОМИЧЕСКИЙ ДИАГНОЗ (Рубрифицированный).
3. КЛИНИКО-ПАТОЛОГОАНАТОМИЧЕСКИЙ ЭПИКРИЗ.
4. КОДЫ МКБ-10.
`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { patientData } = await req.json();
    const apiKey = "AIzaSyANwXRki98C7w5ZaV7CoDToEs2biUKK_zE"; 

    // ИСПОЛЬЗУЕМ "LATEST" (ПОСЛЕДНЮЮ СТАБИЛЬНУЮ)
    // Это самый безопасный вариант. Google сам решит, какую версию дать.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `ВХОДНЫЕ ДАННЫЕ:\n${patientData}\n\nСгенерируй полный протокол.` }]
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

    if (!response.ok) {
        // Читаем ошибку как текст, чтобы не сломать JSON парсер на фронте
        const errorText = await response.text();
        // Бросаем ошибку, которую увидим в консоли, а не "Unexpected token"
        throw new Error(`Google API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error('Модель вернула пустой ответ.');
    }

    return new Response(JSON.stringify({ result: resultText }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // Возвращаем ошибку в JSON формате, чтобы сайт мог её показать
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
    });
  }
}
