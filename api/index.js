// Файл: api.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
  res.json({ message: 'Сервер AI Pathologist работает!' });
});

// Маршрут для генерации макроописания
app.post('/generate-macro', async (req, res) => {
  try {
    const { clinicalData } = req.body;
    
    // Эмуляция ответа ИИ для теста (замените на реальный запрос к DeepSeek когда заработает)
    const generatedText = `Макроописание на основе: ${clinicalData}`;
    
    res.json({ result: generatedText });

  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Обработчик для всех остальных маршрутов
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Экспорт приложения для Vercel
module.exports = app;
