const path = require('path');

const ollamaPath = path.join(
    process.env.OLLAMA_PATH ||
    'C:\\Users\\ACER\\AppData\\Local\\Programs\\Ollama\\ollama.exe'
);

module.exports = { ollamaPath };
