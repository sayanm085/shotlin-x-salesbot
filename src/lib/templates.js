// 📁 src/lib/templates.js
import { sendWhatsAppMessage } from './whatsapp.js';

export const sendInitialMessage = async (lead) => {
  const message = `👋 Hello ${lead.name}, this is Shotlin X — we noticed you're in the ${lead.industry} industry and wanted to tell you how we can help your business grow with powerful software and websites. Let's talk!`;

  await sendWhatsAppMessage(lead.phone, message);
};
