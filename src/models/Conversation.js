// Conversation model for storing message history
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  sender: {
    type: String,
    enum: ['lead', 'ai', 'human'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ConversationSchema = new Schema({
  leadId: {
    type: Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  messages: [MessageSchema],
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
ConversationSchema.index({ leadId: 1 });
ConversationSchema.index({ phone: 1 });

export default model('Conversation', ConversationSchema);