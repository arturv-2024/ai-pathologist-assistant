// ����: api.js
// ��� ��� ������ �� Node.js. �� ����� ��������� ���������� � API DeepSeek.

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// ��� ��������� API-���� �� DeepSeek �� ����� ������� �����
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; // ���������� ��������

// ������� ��� �������� ������� � DeepSeek
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

// ������� ��� ��������� �������������
app.post('/generate-macro', async (req, res) => {
    try {
        const { clinicalData } = req.body;

        const messages = [
            {
                role: "system",
                content: "�� � ��������� ���������������. ���������� ���������, ��������������� ���������������� �������� �� ������ ��������������� ����������� ������ � ������ ��������. ���� ������ � ��������� ����������� ����������� �������. ���������: ������������, �������, ������ �������, ���������� ���������, ������� ����������� � ����������� �������������."
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
        console.error('������ �������:', error);
        res.status(500).json({ error: '���������� ������ �������' });
    }
});

// ������ �������
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`������ ������� �� ����� ${PORT}`));