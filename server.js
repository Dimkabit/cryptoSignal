// // // 



// // // Прокси-сервер для Binance API
// // const express = require('express');
// // const cors = require('cors');
// // const axios = require('axios');
// // const path = require('path');

// // // 🔧 ОПТИМИЗАЦИЯ ПАМЯТИ ДЛЯ RENDER
// // if (process.env.NODE_ENV === 'production') {
// //     const v8 = require('v8');
// //     v8.setFlagsFromString('--max_old_space_size=512');
// //     console.log('🛠️ Установлен лимит памяти: 512MB');
// // }

// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // // 🔧 ДИНАМИЧЕСКИЙ BASE_URL ДЛЯ ВСЕХ СРЕД
// // const BASE_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
// // console.log(`🌐 Base URL: ${BASE_URL}`);

// // // 🔧 ОГРАНИЧЕНИЕ РАЗМЕРА КЭША
// // const MAX_CACHE_SIZE = 1000;
// // const CACHE_DURATION = 60000;

// // const cache = new Map();

// // // 🔧 ФУНКЦИЯ ДЛЯ ОЧИСТКИ КЭША
// // function cleanCacheIfNeeded() {
// //     if (cache.size > MAX_CACHE_SIZE) {
// //         const entries = Array.from(cache.entries());
// //         entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
// //         const toRemove = entries.slice(0, Math.floor(MAX_CACHE_SIZE * 0.3));
// //         toRemove.forEach(([key]) => cache.delete(key));
// //         console.log(`🧹 Удалено ${toRemove.length} записей из кэша`);
// //     }
// // }

// // // 🔧 ОБСЛУЖИВАНИЕ СТАТИЧЕСКИХ ФАЙЛОВ
// // app.use(express.static(path.join(__dirname, '../')));

// // // CORS
// // app.use(cors({
// //     origin: '*',
// //     methods: ['GET', 'POST'],
// //     allowedHeaders: ['Content-Type']
// // }));

// // app.use(express.json({ limit: '1mb' }));

// // // Логирование
// // app.use((req, res, next) => {
// //     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
// //     next();
// // });

// // // 🔧 ФУНКЦИЯ КЭШИРОВАНИЯ
// // async function fetchWithCache(url, key) {
// //     const now = Date.now();
    
// //     if (cache.has(key) && (now - cache.get(key).timestamp) < CACHE_DURATION) {
// //         return cache.get(key).data;
// //     }
    
// //     try {
// //         const response = await axios.get(url, { timeout: 10000 });
// //         cache.set(key, { data: response.data, timestamp: now });
// //         cleanCacheIfNeeded();
// //         return response.data;
// //     } catch (error) {
// //         console.error(`❌ Ошибка: ${url}`, error.message);
// //         if (cache.has(key)) {
// //             return cache.get(key).data;
// //         }
// //         throw error;
// //     }
// // }

// // // 🔧 ГЛАВНАЯ СТРАНИЦА
// // app.get('/', (req, res) => {
// //     res.sendFile(path.join(__dirname, '../index.html'));
// // });

// // // 🔧 ЭНДПОИНТ ДЛЯ ПОЛУЧЕНИЯ BASE_URL (для фронтенда)
// // app.get('/api/config', (req, res) => {
// //     res.json({
// //         success: true,
// //         baseUrl: BASE_URL,
// //         environment: process.env.NODE_ENV || 'development'
// //     });
// // });

// // // Эндпоинт для получения тикеров по символу
// // app.get('/api/ticker/:symbol', async (req, res) => {
// //   try {
// //     const { symbol } = req.params;
// //     const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`;
    
// //     const data = await fetchWithCache(url, `ticker_${symbol}`);
    
// //     res.json({
// //       success: true,
// //       data: data,
// //       timestamp: new Date().toISOString()
// //     });
// //   } catch (error) {
// //     console.error(`❌ Ошибка Binance API для ${req.params.symbol}:`, error.message);
    
// //     // 🔧 ВОЗВРАЩАЕМ ДЕМО-ДАННЫЕ ПРИ ОШИБКЕ
// //     const demoData = generateDemoTickerData(req.params.symbol);
// //     res.json({
// //       success: true,
// //       data: demoData,
// //       isDemo: true,
// //       timestamp: new Date().toISOString()
// //     });
// //   }
// // });

// // // 🔧 ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ ДЕМО-ДАННЫХ БИНАНС
// // function generateDemoTickerData(symbol) {
// //   const basePrices = {
// //     'BTCUSDT': 45000,
// //     'ETHUSDT': 3000,
// //     'ADAUSDT': 0.5,
// //     'DOTUSDT': 10,
// //     'MATICUSDT': 1,
// //     'SOLUSDT': 100,
// //     'AVAXUSDT': 50,
// //     'ATOMUSDT': 15
// //   };
  
// //   const basePrice = basePrices[symbol] || 1;
// //   const change = (Math.random() - 0.5) * 5; // ±5%
// //   const currentPrice = basePrice * (1 + change / 100);
  
// //   return {
// //     symbol: symbol,
// //     lastPrice: currentPrice.toString(),
// //     priceChangePercent: change.toString(),
// //     volume: (Math.random() * 1000000 + 100000).toString(),
// //     highPrice: (currentPrice * 1.03).toString(),
// //     lowPrice: (currentPrice * 0.97).toString(),
// //     quoteVolume: (Math.random() * 50000000 + 10000000).toString()
// //   };
// // }

// // app.get('/api/history/:symbol', async (req, res) => {
// //     try {
// //         const { symbol } = req.params;
// //         let { interval = '1h', limit = '24' } = req.query;
// //         limit = Math.min(parseInt(limit), 100);
        
// //         const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
// //         const data = await fetchWithCache(url, `history_${symbol}_${interval}_${limit}`);
        
// //         const formattedData = data.map(kline => ({
// //             timestamp: kline[0],
// //             open: parseFloat(kline[1]),
// //             high: parseFloat(kline[2]),
// //             low: parseFloat(kline[3]),
// //             close: parseFloat(kline[4]),
// //             volume: parseFloat(kline[5])
// //         }));
        
// //         res.json({
// //             success: true,
// //             data: formattedData,
// //             symbol,
// //             interval,
// //             count: formattedData.length,
// //             timestamp: new Date().toISOString()
// //         });
// //     } catch (error) {
// //         res.status(500).json({
// //             success: false,
// //             error: 'Ошибка исторических данных',
// //             message: error.message
// //         });
// //     }
// // });

// // app.get('/api/status', (req, res) => {
// //     res.json({
// //         success: true,
// //         message: 'CryptoSignal API работает',
// //         version: '1.0.0',
// //         baseUrl: BASE_URL,
// //         timestamp: new Date().toISOString(),
// //         uptime: process.uptime(),
// //         cache_size: cache.size
// //     });
// // });


// // // 🔧 ЭНДПОИНТ ДЛЯ ПОРТФЕЛЯ (заглушки)
// // app.get('/api/portfolio/:userId', (req, res) => {
// //   res.json({
// //     success: true,
// //     data: [],
// //     message: 'Portfolio API - в разработке'
// //   });
// // });

// // // 🔧 ЭНДПОИНТ ДЛЯ ИСТОРИИ СИГНАЛОВ (заглушка)
// // app.get('/tables/signals_history', (req, res) => {
// //   res.json({
// //     success: true,
// //     data: [],
// //     message: 'Signals history - в разработке'
// //   });
// // });

// // app.post('/tables/signals_history', (req, res) => {
// //   res.json({
// //     success: true,
// //     message: 'Signal saved - в разработке'
// //   });
// // });

// // // 🔧 ОЧИСТКА КЭША
// // setInterval(() => {
// //     const now = Date.now();
// //     let cleared = 0;
    
// //     for (const [key, value] of cache.entries()) {
// //         if ((now - value.timestamp) > CACHE_DURATION) {
// //             cache.delete(key);
// //             cleared++;
// //         }
// //     }
    
// //     if (cleared > 0) {
// //         console.log(`🧹 Очищено ${cleared} записей кэша`);
// //     }
// //     cleanCacheIfNeeded();
// // }, 300000);

// // // 🔧 KEEP-ALIVE PING (только на Render)
// // if (process.env.RENDER_EXTERNAL_URL) {
// //     setInterval(() => {
// //         axios.get(`${BASE_URL}/api/status`, { timeout: 5000 })
// //             .then(() => console.log(`✅ Ping OK — ${new Date().toISOString()}`))
// //             .catch(err => console.warn(`⚠️ Ping failed: ${err.message}`));
// //     }, 10 * 60 * 1000);
// // }

// // // Запуск сервера
// // app.listen(PORT, () => {
// //     console.log(`🚀 CryptoSignal API запущен на ${BASE_URL}`);
// //     console.log(`📡 Порт: ${PORT}`);
// //     console.log(`🌐 Режим: ${process.env.NODE_ENV || 'development'}`);
// // });



// // CryptoSignal Server для Render.com
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // 🔧 ОБСЛУЖИВАНИЕ ВСЕХ СТАТИЧЕСКИХ ФАЙЛОВ
// app.use(express.static('.'));

// // CORS
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type']
// }));

// app.use(express.json({ limit: '1mb' }));

// // Логирование
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     next();
// });

// // 🔧 ПРОСТОЙ КЭШ
// const cache = new Map();
// const CACHE_DURATION = 60000; // 60 секунд

// async function fetchWithCache(url, key) {
//     const now = Date.now();
    
//     if (cache.has(key) && (now - cache.get(key).timestamp) < CACHE_DURATION) {
//         return cache.get(key).data;
//     }
    
//     try {
//         const response = await axios.get(url, { timeout: 10000 });
//         cache.set(key, { data: response.data, timestamp: now });
//         return response.data;
//     } catch (error) {
//         console.error(`❌ Ошибка API: ${error.message}`);
//         // Возвращаем демо-данные при ошибке
//         return null;
//     }
// }

// // 🔧 ГЛАВНАЯ СТРАНИЦА
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html')); // ← Просто 'index.html'
// });

// app.use(express.static(__dirname));

// // 🔧 API ЭНДПОИНТЫ С РЕЗЕРВНЫМИ ДАННЫМИ
// app.get('/api/ticker/:symbol', async (req, res) => {
//     try {
//         const { symbol } = req.params;
//         const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`;
        
//         const data = await fetchWithCache(url, `ticker_${symbol}`);
        
//         if (data) {
//             res.json({ success: true, data, timestamp: new Date().toISOString() });
//         } else {
//             // 🔧 ДЕМО-ДАННЫЕ ПРИ ОШИБКЕ
//             const demoData = generateDemoTickerData(symbol);
//             res.json({ success: true, data: demoData, isDemo: true, timestamp: new Date().toISOString() });
//         }
//     } catch (error) {
//         console.error('Ошибка ticker:', error.message);
//         const demoData = generateDemoTickerData(req.params.symbol);
//         res.json({ success: true, data: demoData, isDemo: true, timestamp: new Date().toISOString() });
//     }
// });

// app.get('/api/history/:symbol', async (req, res) => {
//     try {
//         const { symbol } = req.params;
//         let { interval = '1h', limit = '24' } = req.query;
//         limit = Math.min(parseInt(limit), 100);
        
//         const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
//         const data = await fetchWithCache(url, `history_${symbol}_${interval}_${limit}`);
        
//         if (data) {
//             const formattedData = data.map(kline => ({
//                 timestamp: kline[0],
//                 open: parseFloat(kline[1]),
//                 high: parseFloat(kline[2]),
//                 low: parseFloat(kline[3]),
//                 close: parseFloat(kline[4]),
//                 volume: parseFloat(kline[5])
//             }));
//             res.json({ success: true, data: formattedData, symbol, interval, timestamp: new Date().toISOString() });
//         } else {
//             // 🔧 ДЕМО-ИСТОРИЯ ПРИ ОШИБКЕ
//             const demoHistory = generateDemoHistory(symbol, limit);
//             res.json({ success: true, data: demoHistory, isDemo: true, timestamp: new Date().toISOString() });
//         }
//     } catch (error) {
//         console.error('Ошибка history:', error.message);
//         const demoHistory = generateDemoHistory(req.params.symbol, 24);
//         res.json({ success: true, data: demoHistory, isDemo: true, timestamp: new Date().toISOString() });
//     }
// });

// app.get('/api/status', (req, res) => {
//     res.json({
//         success: true,
//         message: 'CryptoSignal API работает ✅',
//         version: '1.0.0',
//         timestamp: new Date().toISOString(),
//         uptime: process.uptime()
//     });
// });

// // 🔧 ЗАГЛУШКИ ДЛЯ ФРОНТЕНДА
// app.get('/tables/signals_history', (req, res) => {
//     res.json({ success: true, data: [] });
// });

// app.post('/tables/signals_history', (req, res) => {
//     res.json({ success: true, message: 'Signal saved' });
// });

// // 🔧 ФУНКЦИИ ДЕМО-ДАННЫХ
// function generateDemoTickerData(symbol) {
//     const basePrices = {
//         'BTCUSDT': 45000, 'ETHUSDT': 3000, 'ADAUSDT': 0.5, 'DOTUSDT': 10,
//         'MATICUSDT': 1, 'SOLUSDT': 100, 'AVAXUSDT': 50, 'ATOMUSDT': 15
//     };
    
//     const basePrice = basePrices[symbol] || 1;
//     const change = (Math.random() - 0.5) * 5;
//     const currentPrice = basePrice * (1 + change / 100);
    
//     return {
//         symbol: symbol,
//         lastPrice: currentPrice.toFixed(4),
//         priceChangePercent: change.toFixed(2),
//         volume: (Math.random() * 1000000 + 100000).toFixed(2),
//         highPrice: (currentPrice * 1.03).toFixed(4),
//         lowPrice: (currentPrice * 0.97).toFixed(4)
//     };
// }

// function generateDemoHistory(symbol, limit) {
//     const basePrices = {
//         'BTCUSDT': 45000, 'ETHUSDT': 3000, 'ADAUSDT': 0.5, 'DOTUSDT': 10,
//         'MATICUSDT': 1, 'SOLUSDT': 100, 'AVAXUSDT': 50, 'ATOMUSDT': 15
//     };
    
//     const basePrice = basePrices[symbol] || 1;
//     const history = [];
//     const now = Date.now();
    
//     for (let i = 0; i < limit; i++) {
//         const timestamp = now - (i * 3600000);
//         const price = basePrice * (1 + (Math.random() - 0.5) * 0.1);
        
//         history.push({
//             timestamp: timestamp,
//             open: price * 0.99,
//             high: price * 1.02,
//             low: price * 0.98,
//             close: price,
//             volume: Math.random() * 1000000 + 100000
//         });
//     }
    
//     return history.reverse();
// }

// // 🔧 ЗАПУСК СЕРВЕРА
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`🚀 CryptoSignal Server запущен!`);
//     console.log(`📡 Порт: ${PORT}`);
//     console.log(`🌐 Режим: ${process.env.NODE_ENV || 'development'}`);
//     console.log(`🕒 Время: ${new Date().toISOString()}`);
// });


const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'crypto-signal-secret-key-2024';

// 🔧 ОПТИМИЗАЦИЯ ПАМЯТИ ДЛЯ RENDER
if (process.env.NODE_ENV === 'production') {
    const v8 = require('v8');
    v8.setFlagsFromString('--max_old_space_size=512');
    console.log('🛠️ Установлен лимит памяти: 512MB');
}

// 🔧 БАЗА ДАННЫХ SQLite
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('❌ Ошибка БД:', err.message);
    } else {
        console.log('✅ SQLite база данных подключена');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Пользователи
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Портфель пользователя
    db.run(`CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        buy_price REAL NOT NULL,
        target_price REAL,
        stop_loss REAL,
        buy_date TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // История сигналов
    db.run(`CREATE TABLE IF NOT EXISTS signals_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        action TEXT NOT NULL,
        entry_price REAL NOT NULL,
        target_price REAL,
        stop_loss REAL,
        confidence INTEGER,
        result TEXT DEFAULT 'pending',
        actual_profit REAL DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Торговые сессии
    db.run(`CREATE TABLE IF NOT EXISTS trading_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        action TEXT NOT NULL,
        entry_price REAL NOT NULL,
        exit_price REAL,
        amount REAL NOT NULL,
        profit_loss REAL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        closed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    console.log('✅ Таблицы базы данных инициализированы');
}

// 🔧 MIDDLEWARE
app.use(express.static(__dirname));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// 🔧 АУТЕНТИФИКАЦИЯ
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'Токен доступа отсутствует' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Неверный токен' });
        }
        req.user = user;
        next();
    });
};

// 🔧 КЭШИРОВАНИЕ
const cache = new Map();
const CACHE_DURATION = 30000; // 30 секунд

async function fetchWithCache(url, key) {
    const now = Date.now();
    
    if (cache.has(key) && (now - cache.get(key).timestamp) < CACHE_DURATION) {
        return cache.get(key).data;
    }
    
    try {
        const response = await axios.get(url, { 
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        cache.set(key, { data: response.data, timestamp: now });
        return response.data;
    } catch (error) {
        console.error(`❌ Ошибка API: ${error.message}`);
        return null;
    }
}

// 🔧 WebSocket для real-time данных
const wss = new WebSocket.Server({ noServer: true });
const clients = new Map();

wss.on('connection', (ws, req) => {
    const clientId = Date.now().toString();
    clients.set(clientId, ws);
    console.log(`🔗 WebSocket подключен: ${clientId}`);

    ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to CryptoSignal Real-time',
        clientId
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'subscribe') {
                // Подписка на обновления символов
                ws.subscriptions = data.symbols || [];
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });

    ws.on('close', () => {
        clients.delete(clientId);
        console.log(`🔗 WebSocket отключен: ${clientId}`);
    });
});

// 🔧 REAL-TIME ОБНОВЛЕНИЯ ЦЕН
async function broadcastPriceUpdates() {
    if (clients.size === 0) return;

    const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT', 'MATICUSDT', 'SOLUSDT', 'AVAXUSDT', 'ATOMUSDT'];
    
    try {
        for (const symbol of symbols) {
            const data = await fetchRealTimeData(symbol);
            if (data) {
                const message = JSON.stringify({
                    type: 'price_update',
                    symbol: data.symbol,
                    price: data.price,
                    change24h: data.change24h,
                    timestamp: Date.now()
                });

                clients.forEach((ws, clientId) => {
                    if (ws.readyState === WebSocket.OPEN && 
                        (!ws.subscriptions || ws.subscriptions.includes(symbol))) {
                        ws.send(message);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Ошибка broadcast:', error);
    }
}

// Запускаем обновления каждые 5 секунд
setInterval(broadcastPriceUpdates, 5000);

// 🔧 РОУТЫ АУТЕНТИФИКАЦИИ

// Регистрация
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email и пароль обязательны' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [email, hashedPassword, name],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ success: false, error: 'Пользователь уже существует' });
                    }
                    return res.status(500).json({ success: false, error: 'Ошибка сервера' });
                }

                const token = jwt.sign({ userId: this.lastID, email }, JWT_SECRET, { expiresIn: '24h' });
                
                res.json({
                    success: true,
                    message: 'Пользователь зарегистрирован',
                    token,
                    user: { id: this.lastID, email, name }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Логин
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email и пароль обязательны' });
        }

        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Ошибка сервера' });
            }
            
            if (!user) {
                return res.status(401).json({ success: false, error: 'Пользователь не найден' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ success: false, error: 'Неверный пароль' });
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
            
            res.json({
                success: true,
                message: 'Успешный вход',
                token,
                user: { id: user.id, email: user.email, name: user.name }
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🔧 РОУТЫ ПОРТФЕЛЯ (требуют аутентификации)

// Получить портфель пользователя
app.get('/api/portfolio', authenticateToken, (req, res) => {
    db.all(
        `SELECT * FROM portfolio WHERE user_id = ? ORDER BY created_at DESC`,
        [req.user.userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Ошибка базы данных' });
            }
            res.json({ success: true, data: rows });
        }
    );
});

// Добавить актив в портфель
app.post('/api/portfolio', authenticateToken, async (req, res) => {
    try {
        const { symbol, name, amount, buy_price, target_price, stop_loss, buy_date, notes } = req.body;
        
        const currentData = await fetchRealTimeData(symbol);
        const current_price = currentData ? currentData.price : buy_price;

        db.run(
            `INSERT INTO portfolio (user_id, symbol, name, amount, buy_price, target_price, stop_loss, buy_date, notes) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.userId, symbol, name, amount, buy_price, target_price, stop_loss, buy_date, notes],
            function(err) {
                if (err) {
                    return res.status(500).json({ success: false, error: 'Ошибка сохранения' });
                }

                const portfolioItem = {
                    id: this.lastID,
                    user_id: req.user.userId,
                    symbol,
                    name,
                    amount,
                    buy_price,
                    target_price,
                    stop_loss,
                    buy_date,
                    notes,
                    current_price,
                    total_value: current_price * amount,
                    profit_loss: (current_price - buy_price) * amount,
                    profit_loss_percent: ((current_price - buy_price) / buy_price) * 100
                };

                res.json({
                    success: true,
                    message: 'Актив добавлен в портфель',
                    data: portfolioItem
                });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Удалить актив из портфеля
app.delete('/api/portfolio/:id', authenticateToken, (req, res) => {
    db.run(
        'DELETE FROM portfolio WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.userId],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, error: 'Ошибка удаления' });
            }
            res.json({ success: true, message: 'Актив удален из портфеля' });
        }
    );
});

// 🔧 РОУТЫ СИГНАЛОВ И ИСТОРИИ

// Получить историю сигналов
app.get('/api/signals/history', authenticateToken, (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    
    db.all(
        `SELECT * FROM signals_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?`,
        [req.user.userId, limit],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Ошибка базы данных' });
            }
            res.json({ success: true, data: rows });
        }
    );
});

// Сохранить сигнал в историю
app.post('/api/signals/history', authenticateToken, (req, res) => {
    const { symbol, name, action, entry_price, target_price, stop_loss, confidence, result, actual_profit } = req.body;
    
    db.run(
        `INSERT INTO signals_history (user_id, symbol, name, action, entry_price, target_price, stop_loss, confidence, result, actual_profit) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.userId, symbol, name, action, entry_price, target_price, stop_loss, confidence, result, actual_profit],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, error: 'Ошибка сохранения' });
            }
            res.json({ success: true, message: 'Сигнал сохранен в историю' });
        }
    );
});

// 🔧 РЕАЛЬНЫЕ ДАННЫЕ BINANCE API

async function fetchRealTimeData(symbol) {
    try {
        const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`;
        const data = await fetchWithCache(url, `realtime_${symbol}`);
        
        if (data) {
            return {
                symbol: data.symbol,
                price: parseFloat(data.lastPrice),
                change24h: parseFloat(data.priceChangePercent),
                volume: parseFloat(data.volume),
                high: parseFloat(data.highPrice),
                low: parseFloat(data.lowPrice),
                timestamp: Date.now()
            };
        }
    } catch (error) {
        console.error(`Ошибка реальных данных для ${symbol}:`, error.message);
    }
    
    // 🔧 РЕЗЕРВНЫЕ ДЕМО-ДАННЫЕ
    return generateDemoTickerData(symbol);
}

// 🔧 ОСНОВНЫЕ API ЭНДПОИНТЫ

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'CryptoSignal API работает с реальными данными ✅',
        version: '2.0.0',
        features: ['real-time', 'authentication', 'database', 'websocket'],
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        clients: clients.size
    });
});

// 🔧 REAL-TIME DATA ENDPOINT
app.get('/api/realtime/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const data = await fetchRealTimeData(symbol);
        
        res.json({
            success: true,
            data: data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        const demoData = generateDemoTickerData(req.params.symbol);
        res.json({ success: true, data: demoData, isDemo: true });
    }
});

// 🔧 ИСТОРИЧЕСКИЕ ДАННЫЕ
app.get('/api/history/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        let { interval = '1h', limit = '100' } = req.query;
        limit = Math.min(parseInt(limit), 500);
        
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        const data = await fetchWithCache(url, `history_${symbol}_${interval}_${limit}`);
        
        if (data) {
            const formattedData = data.map(kline => ({
                timestamp: kline[0],
                open: parseFloat(kline[1]),
                high: parseFloat(kline[2]),
                low: parseFloat(kline[3]),
                close: parseFloat(kline[4]),
                volume: parseFloat(kline[5])
            }));
            
            res.json({
                success: true,
                data: formattedData,
                symbol,
                interval,
                count: formattedData.length,
                timestamp: new Date().toISOString()
            });
        } else {
            const demoHistory = generateDemoHistory(symbol, limit);
            res.json({ success: true, data: demoHistory, isDemo: true });
        }
    } catch (error) {
        const demoHistory = generateDemoHistory(req.params.symbol, 100);
        res.json({ success: true, data: demoHistory, isDemo: true });
    }
});

// 🔧 ФУНКЦИИ ДЕМО-ДАННЫХ
function generateDemoTickerData(symbol) {
    const basePrices = {
        'BTCUSDT': 45000, 'ETHUSDT': 3000, 'ADAUSDT': 0.5, 'DOTUSDT': 10,
        'MATICUSDT': 1, 'SOLUSDT': 100, 'AVAXUSDT': 50, 'ATOMUSDT': 15
    };
    
    const basePrice = basePrices[symbol] || 1;
    const change = (Math.random() - 0.5) * 5;
    const currentPrice = basePrice * (1 + change / 100);
    
    return {
        symbol: symbol,
        price: currentPrice,
        change24h: change,
        volume: Math.random() * 1000000 + 100000,
        high: currentPrice * 1.03,
        low: currentPrice * 0.97,
        timestamp: Date.now(),
        isDemo: true
    };
}

function generateDemoHistory(symbol, limit) {
    const basePrices = {
        'BTCUSDT': 45000, 'ETHUSDT': 3000, 'ADAUSDT': 0.5, 'DOTUSDT': 10,
        'MATICUSDT': 1, 'SOLUSDT': 100, 'AVAXUSDT': 50, 'ATOMUSDT': 15
    };
    
    const basePrice = basePrices[symbol] || 1;
    const history = [];
    const now = Date.now();
    
    for (let i = 0; i < limit; i++) {
        const timestamp = now - (i * 3600000);
        const price = basePrice * (1 + (Math.random() - 0.5) * 0.1);
        
        history.push({
            timestamp: timestamp,
            open: price * 0.99,
            high: price * 1.02,
            low: price * 0.98,
            close: price,
            volume: Math.random() * 1000000 + 100000
        });
    }
    
    return history.reverse();
}

// 🔧 WebSocket UPGRADE
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CryptoSignal Server запущен!`);
    console.log(`📡 Порт: ${PORT}`);
    console.log(`🌐 Режим: ${process.env.NODE_ENV || 'production'}`);
    console.log(`🔗 WebSocket: ws://localhost:${PORT}`);
    console.log(`🕒 Время: ${new Date().toISOString()}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// 🔧 ОЧИСТКА КЭША
setInterval(() => {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, value] of cache.entries()) {
        if ((now - value.timestamp) > CACHE_DURATION) {
            cache.delete(key);
            cleared++;
        }
    }
    
    if (cleared > 0) {
        console.log(`🧹 Очищено ${cleared} записей кэша`);
    }
}, 60000);