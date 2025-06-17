// Lead model
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const LeadSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  shopName: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'proposal_sent', 'closed_won', 'closed_lost'],
    default: 'new'
  },
  notes: {
    type: String
  },
  lastContactedAt: {
    type: Date
  },
  aiEnabled: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['manual', 'csv_import', 'whatsapp'],
    default: 'manual'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster queries
LeadSchema.index({ phone: 1 });
LeadSchema.index({ status: 1 });

export default model('Lead', LeadSchema);