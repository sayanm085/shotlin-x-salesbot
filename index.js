// Main Entry Point
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';  // Changed from destructured import
import app from './src/app.js';
import { initialize as initializeWhatsApp } from './src/lib/whatsapp.js';
import { initialize as initializeReminders } from './src/lib/reminders.js';
import { logger } from './src/lib/logger.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start services
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();  // Changed to use default export
    
    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Shotlin X Sales Agent running on port ${PORT}`);
    });
    
    // Initialize WhatsApp client
    await initializeWhatsApp();
    
    // Initialize reminder system
    await initializeReminders();
    
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Don't crash in production
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});