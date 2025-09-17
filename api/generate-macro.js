// Файл: api/generate-macro.js
module.exports = async (req, res) => {
  // Настройка CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight запросов
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { clinicalData } = req.body;
      
      // ТЕСТОВЫЙ ОТВЕТ
      const generatedText = `Макроописание на основе: ${clinicalData}`;
      
      return res.json({ result: generatedText });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Для GET запросов
  return res.json({ message: 'Endpoint для генерации макроописания' });
};
