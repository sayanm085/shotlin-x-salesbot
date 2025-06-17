// Restricted number routes
import express from 'express';
import { restrictNumber, unrestrictNumber } from '../lib/restrict.js';
import RestrictedNumber from '../models/RestrictedNumber.js';

const router = express.Router();

// Get all restricted numbers
router.get('/', async (req, res, next) => {
  try {
    const restrictedNumbers = await RestrictedNumber.find({ active: true });
    
    res.status(200).json({
      success: true,
      count: restrictedNumbers.length,
      data: restrictedNumbers
    });
  } catch (error) {
    next(error);
  }
});

// Restrict a number
router.post('/', async (req, res, next) => {
  try {
    const { phone, reason } = req.body;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }
    
    const restricted = await restrictNumber(
      phone, 
      reason || '',
      req.user?.username || 'API'
    );
    
    res.status(201).json({
      success: true,
      data: restricted
    });
  } catch (error) {
    next(error);
  }
});

// Unrestrict a number
router.delete('/:phone', async (req, res, next) => {
  try {
    const result = await unrestrictNumber(req.params.phone);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Restricted number not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;