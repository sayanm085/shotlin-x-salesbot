// Restricted number model for blocking numbers from AI responses
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const RestrictedNumberSchema = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  reason: {
    type: String,
    trim: true
  },
  blockedBy: {
    type: String,
    trim: true
  },
  blockedAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default model('RestrictedNumber', RestrictedNumberSchema);