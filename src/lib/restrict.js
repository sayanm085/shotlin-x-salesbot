// Restriction system for blocking numbers from AI responses
import RestrictedNumber from '../models/RestrictedNumber.js';
import { logger } from './logger.js';

// Check if a number is restricted
export const isRestricted = async (phoneNumber) => {
  try {
    const restricted = await RestrictedNumber.findOne({ 
      phone: phoneNumber,
      active: true 
    });
    
    return !!restricted; // Convert to boolean
  } catch (error) {
    logger.error(`Error checking if ${phoneNumber} is restricted:`, error);
    return false; // Default to not restricted on error
  }
};

// Restrict a number
export const restrictNumber = async (phoneNumber, reason = '', blockedBy = '') => {
  try {
    const restricted = await RestrictedNumber.findOneAndUpdate(
      { phone: phoneNumber },
      { 
        phone: phoneNumber,
        reason,
        blockedBy,
        blockedAt: new Date(),
        active: true
      },
      { upsert: true, new: true }
    );
    
    logger.info(`Restricted number ${phoneNumber}. Reason: ${reason}`);
    return restricted;
  } catch (error) {
    logger.error(`Error restricting ${phoneNumber}:`, error);
    throw error;
  }
};

// Unrestrict a number
export const unrestrictNumber = async (phoneNumber) => {
  try {
    const result = await RestrictedNumber.findOneAndUpdate(
      { phone: phoneNumber },
      { active: false },
      { new: true }
    );
    
    logger.info(`Unrestricted number ${phoneNumber}`);
    return result;
  } catch (error) {
    logger.error(`Error unrestricting ${phoneNumber}:`, error);
    throw error;
  }
};