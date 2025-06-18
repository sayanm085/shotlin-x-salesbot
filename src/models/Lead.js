// 📁 src/models/Lead.js
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: { type: String, required: true },
  shopName: String,
  industry: String,
  status: { type: String, default: 'new' },
  notes: String,
  lastRepliedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Lead', leadSchema);
