// Middleware to toggle AI bot for specific leads
import Lead from '../models/Lead.js';
import { logger } from '../lib/logger.js';

export const checkBotStatus = async (req, res, next) => {
  try {
    const phone = req.params.phone || req.body.phone;
    
    if (!phone) {
      return next();
    }
    
    // Check if AI is enabled for this lead
    const lead = await Lead.findOne({ phone });
    
    if (lead && !lead.aiEnabled) {
      return res.status(403).json({
        success: false,
        error: 'AI responses are disabled for this lead'
      });
    }
    
    next();
  } catch (error) {
    logger.error('Error checking bot status:', error);
    next();
  }
};

export const toggleBot = async (req, res, next) => {
  try {
    const { phone } = req.params;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }
    
    // Find lead
    const lead = await Lead.findOne({ phone });
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    // Toggle AI
    lead.aiEnabled = !lead.aiEnabled;
    await lead.save();
    
    res.status(200).json({
      success: true,
      data: {
        phone,
        aiEnabled: lead.aiEnabled
      }
    });
  } catch (error) {
    next(error);
  }
};

export default { checkBotStatus, toggleBot };