// Message controller for handling incoming WhatsApp messages
import Lead from '../models/Lead.js';
import Conversation from '../models/Conversation.js';
import { processAIResponse } from '../lib/ai.js';
import { isRestricted } from '../lib/restrict.js';
import { scheduleReminder, cancelReminders } from '../lib/reminders.js';
import { logger } from '../lib/logger.js';

// Handle incoming WhatsApp messages
export const handleIncomingMessage = async (msg) => {
  const senderNumber = msg.from.replace('@c.us', '');
  const messageBody = msg.body;
  
  try {
    // Check if number is restricted
    if (await isRestricted(senderNumber)) {
      logger.info(`Message from restricted number ${senderNumber} ignored`);
      return null;
    }
    
    // Find or create lead
    let lead = await Lead.findOne({ phone: senderNumber });
    
    if (!lead) {
      // New lead from WhatsApp
      lead = await Lead.create({
        phone: senderNumber,
        name: 'WhatsApp User', // Default name
        source: 'whatsapp',
        status: 'new'
      });
      logger.info(`Created new lead from WhatsApp: ${senderNumber}`);
      
      // Schedule day1 follow-up
      await scheduleReminder(lead._id, 'day1');
    } else {
      // Cancel any pending reminders as customer has responded
      await cancelReminders(lead._id);
    }
    
    // Check if AI is enabled for this lead
    if (!lead.aiEnabled) {
      logger.info(`AI responses disabled for ${senderNumber}, ignoring message`);
      return null;
    }
    
    // Update last contacted time
    lead.lastContactedAt = new Date();
    await lead.save();
    
    // Process with AI and get response
    const aiResponse = await processAIResponse(senderNumber, messageBody, lead);
    
    // If lead doesn't have a day6 reminder yet, schedule one
    const existingDay6 = await Reminder.findOne({
      leadId: lead._id,
      type: 'day6',
      status: 'pending'
    });
    
    if (!existingDay6) {
      await scheduleReminder(lead._id, 'day6');
    }
    
    return aiResponse;
    
  } catch (error) {
    logger.error(`Error processing message from ${senderNumber}:`, error);
    return "I apologize, but I'm experiencing technical difficulties. Our team will get back to you shortly.";
  }
};