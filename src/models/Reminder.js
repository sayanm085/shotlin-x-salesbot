// Reminder model for follow-up scheduling
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ReminderSchema = new Schema({
  leadId: {
    type: Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['day1', 'day6', 'custom'],
    required: true
  },
  scheduled: {
    type: Date,
    required: true
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'cancelled'],
    default: 'pending'
  },
  sentAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create index for faster queries
ReminderSchema.index({ scheduled: 1, status: 1 });
ReminderSchema.index({ leadId: 1 });
ReminderSchema.index({ phone: 1 });

export default model('Reminder', ReminderSchema);