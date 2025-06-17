// WhatsApp integration
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';
import * as messageController from '../controllers/messageController.js';

// For __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a client instance
let client;

// Initialize WhatsApp client
export const initialize = async () => {
  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: path.resolve(process.env.WHATSAPP_SESSION_DATA_PATH || './session-data')
    }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  // Generate QR code for authentication
  client.on('qr', (qr) => {
    logger.info('QR RECEIVED. Scan with WhatsApp:');
    qrcode.generate(qr, { small: true });
  });

  // Client is ready
  client.on('ready', () => {
    logger.info('WhatsApp client is ready!');
  });

  // Handle incoming messages
  client.on('message', async (msg) => {
    if (msg.from.endsWith('@c.us')) { // Filter out group messages
      try {
        const response = await messageController.handleIncomingMessage(msg);
        if (response) {
          await msg.reply(response);
        }
      } catch (error) {
        logger.error('Error handling message:', error);
      }
    }
  });

  // Authentication failure
  client.on('auth_failure', (error) => {
    logger.error('WhatsApp authentication failed:', error);
  });

  // Initialize client
  try {
    await client.initialize();
    return client;
  } catch (err) {
    logger.error('Failed to initialize WhatsApp client:', err);
    throw err;
  }
};

// Send message to a specific number
export const sendMessage = async (to, message) => {
  try {
    if (!client) {
      throw new Error('WhatsApp client not initialized');
    }
    
    // Format number to international format if needed
    const formattedNumber = to.includes('@c.us') ? to : `${to}@c.us`;
    await client.sendMessage(formattedNumber, message);
    logger.debug(`Message sent to ${to}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send message to ${to}:`, error);
    return false;
  }
};

// Send message to admin/team
export const notifyAdmin = async (message) => {
  try {
    if (!client) {
      throw new Error('WhatsApp client not initialized');
    }
    
    // Send to admin
    if (process.env.ADMIN_PHONE) {
      await sendMessage(process.env.ADMIN_PHONE, `🤖 SHOTLIN X ALERT: ${message}`);
    }
    
    // Send to team group if configured
    if (process.env.TEAM_GROUP_ID) {
      await client.sendMessage(process.env.TEAM_GROUP_ID, `🤖 SHOTLIN X ALERT: ${message}`);
    }
    
    return true;
  } catch (error) {
    logger.error('Failed to notify admin:', error);
    return false;
  }
};

export { client };