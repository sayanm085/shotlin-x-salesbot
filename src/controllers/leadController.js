// 📁 src/controllers/leadController.js
import Lead from '../models/Lead.js';
import { sendInitialMessage } from '../lib/templates.js';
import { scheduleReminders } from '../lib/reminders.js';

export const createLead = async (req, res) => {
  try {
    const leadData = req.body;

    // Save to DB
    const newLead = await Lead.create(leadData);

    // Send initial WhatsApp message
    await sendInitialMessage(newLead);

    // Schedule reminders
    await scheduleReminders(newLead);

    res.status(201).json({ success: true, message: 'Lead created and message sent!' });
  } catch (err) {
    console.error("Error creating lead:", err.message);
    res.status(500).json({ success: false, message: 'Failed to create lead.' });
  }
};
