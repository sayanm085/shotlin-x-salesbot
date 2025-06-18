// 📁 src/lib/whatsapp.js
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { handleIncomingMessage } from '../controllers/messageController.js';

import {generateReply } from "./ai.js"

const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('📱 Scan the QR code above to connect WhatsApp');
});

client.on('ready', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   🚀 SHOTLIN X WHATSAPP BOT SUCCESSFULLY CONNECTED AND READY! 🚀          ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);
});

client.on('message', async (msg) => {
  console.log(`✉️ Received message from ${msg.from}: ${msg.body}`);
  await handleIncomingMessage(msg);
});

client.initialize();

export const sendWhatsAppMessage = async (phone, message) => {
  const chatId = `${phone.replace(/[^0-9]/g, '')}@c.us`;
  console.log(`💬 Sending to ${chatId}: ${message}`);
  await client.sendMessage(chatId, message);
};

export { client };
