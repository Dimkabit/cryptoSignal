// ping.js
const axios = require('axios');
const URL = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';

setInterval(async () => {
  try {
    const res = await axios.get(`${URL}/api/status`);
    console.log(`✅ Ping OK ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error(`⚠️ Ping failed: ${err.message}`);
  }
}, 600000); // каждые 10 минут
