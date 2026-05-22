import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/db.js';
import categoryRoutes from './routes/categoryRoutes.js';
import speakerRoutes from './routes/speakerRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

const app = express();

// Connect to database
connectDatabase();

// Middleware
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Root Endpoint for Health Checks (Railway often pings /)
app.get('/', (_req, res) => {
  res.send('Backend API is running. Go to /api/status for more info.');
});

// API Status Check
app.get('/api/status', (_req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/events', eventRoutes);

// Use simple OR assignment so Nixpacks correctly detects the fallback port
const PORT = process.env.PORT || 8080;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Express] Backend API running on port ${PORT} host 0.0.0.0`);
});

// Export app instance (used as serverless function)
export default app;
