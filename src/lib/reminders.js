// 📁 src/lib/reminders.js
import { sendWhatsAppMessage } from './whatsapp.js';
import Lead from '../models/Lead.js';

export const scheduleReminders = async (lead) => {
  const dayMs = 24 * 60 * 60 * 1000;

  setTimeout(async () => {
    const freshLead = await Lead.findById(lead._id);
    if (!freshLead.lastRepliedAt) {
      const msg = `📢 Hi ${lead.name}, just a quick reminder from Shotlin X! We're excited to help you grow your business with our tech solutions. Let’s talk!`;
      await sendWhatsAppMessage(lead.phone, msg);
    }
  }, dayMs); // 1-day reminder

  setTimeout(async () => {
    const freshLead = await Lead.findById(lead._id);
    if (!freshLead.lastRepliedAt) {
      const msg = `⏰ Final reminder, ${lead.name}! Our offer to help you build a modern, powerful business platform is still open. Reply to continue. 🚀`;
      await sendWhatsAppMessage(lead.phone, msg);
    }
  }, 6 * dayMs); // 6-day reminder
};
