import { generateReply } from '../lib/ai.js';
import { sendWhatsAppMessage } from '../lib/whatsapp.js';
import Lead from '../models/Lead.js';

export const handleIncomingMessage = async (msg) => {
  const phone = msg.from.replace('@c.us', ''); // Normalize phone
  const userMessage = msg.body?.trim();

  try {
    const lead = await Lead.findOne({ phone });
    if (!lead) {
      console.log(`❌ Lead not found for phone: ${phone}`);
      return;
    }

    // Avoid duplicate AI replies
    if (!lead.lastAIReply || lead.lastUserMessage !== userMessage) {
      const reply = await generateReply(userMessage, lead);
      console.log(`🤖 Gemini AI reply: ${reply}`);

      await sendWhatsAppMessage(phone, reply);

      lead.lastAIReply = reply;
      lead.lastUserMessage = userMessage;
      lead.status = 'contacted';
      await lead.save();
    }
  } catch (err) {
    console.error('💥 AI Message Handling Error:', err);
  }
};
