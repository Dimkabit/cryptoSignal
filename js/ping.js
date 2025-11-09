//ping.js

const axios = require('axios');

const URL = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';

async function pingServer() {
    try {
        const res = await axios.get(`${URL}/api/status`, { timeout: 10000 });
        console.log(`✅ Ping OK ${new Date().toLocaleTimeString()}`);
    } catch (err) {
        console.error(`⚠️ Ping failed: ${err.message}`);
    }
}

// Запуск только если файл вызван напрямую
if (require.main === module) {
    // Первый пинг сразу при запуске
    pingServer();
    
    // Затем каждые 10 минут
    setInterval(pingServer, 600000);
}

module.exports = { pingServer };