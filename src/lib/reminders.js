// Follow-up reminder system
import { Agenda } from 'agenda';
import mongoose from 'mongoose';
import { sendMessage } from './whatsapp.js';
import Lead from '../models/Lead.js';
import Reminder from '../models/Reminder.js';
import { generateFollowUpMessage } from './ai.js';
import { logger } from './logger.js';

// Create agenda instance
const agenda = new Agenda({
  db: {
    address: process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI,
    collection: 'agendaJobs'
  }
});

// Define jobs
export const initialize = async () => {
  // Process pending reminders
  agenda.define('process-reminders', async (job) => {
    try {
      logger.info('Processing pending reminders...');
      
      // Find due reminders
      const dueReminders = await Reminder.find({
        status: 'pending',
        scheduled: { $lte: new Date() }
      }).populate('leadId');
      
      logger.info(`Found ${dueReminders.length} due reminders`);
      
      for (const reminder of dueReminders) {
        try {
          // Skip if lead doesn't exist or AI is disabled
          if (!reminder.leadId || !reminder.leadId.aiEnabled) {
            reminder.status = 'cancelled';
            await reminder.save();
            continue;
          }
          
          // Generate message if not already set
          const message = reminder.message || await generateFollowUpMessage(
            reminder.leadId._id,
            reminder.type
          );
          
          // Send message
          const sent = await sendMessage(reminder.phone, message);
          
          if (sent) {
            reminder.status = 'sent';
            reminder.sentAt = new Date();
            logger.info(`Reminder sent to ${reminder.phone}`);
          } else {
            reminder.status = 'failed';
            logger.error(`Failed to send reminder to ${reminder.phone}`);
          }
          
          await reminder.save();
        } catch (error) {
          logger.error(`Error processing reminder ${reminder._id}:`, error);
          reminder.status = 'failed';
          await reminder.save();
        }
      }
    } catch (error) {
      logger.error('Error in process-reminders job:', error);
    }
  });
  
  // Schedule reminder processing job (every 5 minutes)
  await agenda.every('5 minutes', 'process-reminders');
  
  // Start agenda
  await agenda.start();
  logger.info('Reminder system initialized');
};

// Schedule a follow-up reminder
export const scheduleReminder = async (leadId, type = 'day1') => {
  try {
    const lead = await Lead.findById(leadId);
    if (!lead) throw new Error(`Lead not found: ${leadId}`);
    
    // Calculate scheduled time
    let scheduledDate = new Date();
    if (type === 'day1') {
      scheduledDate.setDate(scheduledDate.getDate() + 1); // 1 day later
    } else if (type === 'day6') {
      scheduledDate.setDate(scheduledDate.getDate() + 6); // 6 days later
    }
    
    // Create reminder
    const reminder = new Reminder({
      leadId,
      phone: lead.phone,
      type,
      scheduled: scheduledDate,
      status: 'pending'
    });
    
    await reminder.save();
    logger.info(`Scheduled ${type} reminder for ${lead.phone} at ${scheduledDate}`);
    return reminder;
  } catch (error) {
    logger.error(`Error scheduling reminder:`, error);
    throw error;
  }
};

// Cancel all reminders for a lead
export const cancelReminders = async (leadId) => {
  try {
    const result = await Reminder.updateMany(
      { leadId, status: 'pending' },
      { status: 'cancelled' }
    );
    
    logger.info(`Cancelled ${result.modifiedCount} reminders for lead ${leadId}`);
    return result.modifiedCount;
  } catch (error) {
    logger.error(`Error cancelling reminders:`, error);
    throw error;
  }
};

export { agenda };