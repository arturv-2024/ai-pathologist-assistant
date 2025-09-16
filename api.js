// Файл: api.js
// Это наш сервер на Node.js. Он будет безопасно обращаться к API DeepSeek.

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Ваш настоящий API-ключ от DeepSeek мы будем хранить здесь
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; // Безопасное хранение

// Функция для отправки запроса к DeepSeek
async function queryDeepSeek(messages) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: messages,
      temperature: 0.1,
      max_tokens: 2000
    })
  });
  return await response.json();
}

// Маршрут для генерации макроописания
app.post('/generate-macro', async (req, res) => {
  try {
    const { clinicalData } = req.body;

    const messages = [
      {
        role: "system",
        content: "Ты — ассистент патологоанатома. Сгенерируй подробное, формализованное макроскопическое описание на основе предоставленных клинических данных и данных вскрытия. Будь точным и используй стандартные медицинские термины. Структура: телосложение, питание, кожные покровы, посмертные изменения, видимые повреждения и медицинские вмешательства."
      },
      {
        role: "user",
        content: clinicalData
      }
    ];

    const deepSeekData = await queryDeepSeek(messages);
    const generatedText = deepSeekData.choices[0].message.content;

    res.json({ result: generatedText });

  } catch (error) {
    console.error('Ошибка сервера:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));