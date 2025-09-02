const { spawn } = require('child_process');
const { ollamaPath } = require('../config/ollamaai');

const runAI = async (req, res) => {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // 1️⃣ Chuẩn bị prompt hướng dẫn cho Ollama
        const instruction = `
Bạn là trợ lý ảo thân thiện cho cửa hàng đồ uống.
Trả lời theo giọng thân thiện, không nói "tôi là máy tính".
Hãy trả lời trực tiếp câu hỏi của khách hàng.
`;

        const finalPrompt = `${instruction}\nKhách hàng hỏi: ${prompt}`;

        // 2️⃣ Chạy Ollama AI
        const ollama = spawn(ollamaPath, ['run', 'mistral']);
        let output = '';
        let errorOutput = '';

        ollama.stdin.write(finalPrompt + '\n');
        ollama.stdin.end();

        ollama.stdout.on('data', (data) => {
            output += data.toString();
        });

        ollama.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        ollama.on('close', (code) => {
            if (code === 0) {
                res.json({
                    response: output.trim() || "Mình chưa hiểu, bạn có thể nói rõ hơn?"
                });
            } else {
                console.error('Ollama error:', errorOutput);
                res.status(500).json({ error: 'Ollama process failed', details: errorOutput });
            }
        });

        ollama.on('error', (err) => {
            console.error('Failed to start Ollama:', err);
            res.status(500).json({ error: 'Failed to start Ollama', details: err.message });
        });

    } catch (err) {
        console.error('AI controller error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

module.exports = { runAI };
