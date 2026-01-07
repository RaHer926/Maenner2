import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './index.js';
import { createContext } from './context.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from dist directory
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// tRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
const host = '0.0.0.0'; // Bind to all interfaces for production
app.listen(port, host, () => {
  console.log(`🚀 Server running on http://${host}:${port}`);
  console.log(`📊 Database: Connected`);
  console.log(`🔗 tRPC endpoint: http://${host}:${port}/trpc`);
});
