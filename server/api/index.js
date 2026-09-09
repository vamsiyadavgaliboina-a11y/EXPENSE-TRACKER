import app from '../server.js';
import connectDB from '../config/db.js';

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const allowedOrigin = origin === 'https://expense-tracker-ochre-xi-58.vercel.app'
    || origin === 'http://localhost:5173'
    || origin === 'http://localhost:5174';

  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  if (req.url?.includes('/health')) {
    return app(req, res);
  }

  try {
    await connectDB();
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    return res.status(503).json({ message: 'Database connection is unavailable' });
  }

  try {
    return app(req, res);
  } catch (error) {
    console.error('Request handling failed:', error.message);
    return res.status(500).json({ message: 'Request failed' });
  }
}