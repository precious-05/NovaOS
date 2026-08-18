const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  gmailMessageId: {
    type: String,
    unique: true,
    sparse: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    default: ''
  },
  body: {
    type: String,
    default: ''
  },
  aiSummary: {
    type: String,
    default: ''
  },
  aiReply: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread'
  },
  receivedAt: {
    type: Date,
    default: Date.now
  }
});

const Email = mongoose.models.Email || mongoose.model('Email', emailSchema);

module.exports = { Email };