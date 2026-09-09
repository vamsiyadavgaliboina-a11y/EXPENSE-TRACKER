import app from '../server/server.js';
import connectDB from '../server/config/db.js';

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin === 'https://expense-tracker-ochre-xi-58.vercel.app') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  await connectDB();
  return app(req, res);
}