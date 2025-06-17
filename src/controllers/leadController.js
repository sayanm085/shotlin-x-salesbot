// Lead controller for managing leads
import Lead from '../models/Lead.js';
import csv from 'csvtojson';
import { logger } from '../lib/logger.js';

// Get all leads
export const getLeads = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    // Build filter
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    // Get total count
    const total = await Lead.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      },
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

// Get lead by ID
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// Create new lead
export const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    
    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// Update lead
export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// Delete lead
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    await lead.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Import leads from CSV
export const importLeads = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a CSV file'
      });
    }
    
    // Parse CSV
    const jsonArray = await csv().fromFile(req.file.path);
    
    // Validate and transform data
    const leads = jsonArray.map(item => ({
      name: item.name || 'Unknown',
      phone: item.phone,
      email: item.email || null,
      shopName: item.shopName || item.business || null,
      industry: item.industry || null,
      source: 'csv_import'
    }));
    
    // Filter out entries without phone numbers
    const validLeads = leads.filter(lead => lead.phone);
    
    if (validLeads.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid leads found in CSV'
      });
    }
    
    // Insert leads (ignore duplicates)
    const result = await Lead.insertMany(validLeads, { ordered: false })
      .catch(err => {
        // Filter out duplicate key errors
        const inserted = err.insertedDocs || [];
        return inserted;
      });
    
    res.status(201).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    logger.error('Error importing leads:', error);
    next(error);
  }
};

// Toggle AI for a lead
export const toggleAI = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    
    lead.aiEnabled = !lead.aiEnabled;
    await lead.save();
    
    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};