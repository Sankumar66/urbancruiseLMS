const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  service: { type: String },
  vehicle: { type: String },
  city: { type: String },
  rentalDays: { type: String },
  rentalMonths: { type: String },
  source: { type: String, enum: ['website', 'meta', 'google'], required: true },
  campaign: { type: String },
  keyword: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'lost'], default: 'new' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lead', leadSchema);