// Main Express Application
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import compression from 'compression';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import leadRoutes from './routes/leadRoutes.js';
import restrictRoutes from './routes/restrictRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

// For __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors());
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Request logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/leads', leadRoutes);
app.use('/api/restrict', restrictRoutes);
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;