// Email routes
import express from 'express';
import { sendEmail, sendProposal } from '../lib/email.js';
import Lead from '../models/Lead.js';

const router = express.Router();

// Send email to lead
router.post('/send/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, templateName, data } = req.body;
    
    const lead = await Lead.findById(id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    if (!lead.email) {
      return res.status(400).json({
        success: false,
        error: 'Lead does not have an email address'
      });
    }
    
    const result = await sendEmail(
      lead.email,
      subject || `Information from Shotlin - ${lead.shopName || 'Web Development'}`,
      templateName || 'basic',
      {
        name: lead.name,
        ...data
      }
    );
    
    res.status(200).json({
      success: result.success,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// Send proposal to lead
router.post('/proposal/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { packageDetails } = req.body;
    
    const lead = await Lead.findById(id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    if (!lead.email) {
      return res.status(400).json({
        success: false,
        error: 'Lead does not have an email address'
      });
    }
    
    const result = await sendProposal(lead, packageDetails);
    
    // Update lead status if email was sent successfully
    if (result.success) {
      lead.status = 'proposal_sent';
      await lead.save();
    }
    
    res.status(200).json({
      success: result.success,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;