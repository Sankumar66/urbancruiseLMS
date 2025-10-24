const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  action: {
    type: String,
    enum: ['CREATE_LEAD', 'UPDATE_LEAD', 'DELETE_LEAD', 'IMPORT_LEADS', 'EXPORT_LEADS', 'LOGIN', 'LOGOUT', 'FULL_ACCESS_GRANTED'],
    required: true
  },
  entityType: {
    type: String,
    enum: ['LEAD', 'USER', 'SYSTEM'],
    required: true
  },
  entityId: { type: String },
  description: { type: String, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String },
  oldData: { type: mongoose.Schema.Types.Mixed },
  newData: { type: mongoose.Schema.Types.Mixed },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now, expires: '24h' }, // Auto-delete after 24 hours
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);