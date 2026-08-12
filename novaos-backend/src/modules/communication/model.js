const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    enum: ['email', 'whatsapp'],
    required: [true, 'Channel is required']
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
});

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: String,
    enum: ['customer', 'ai'],
    required: true
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true
  },
  intent: {
    type: String,
    default: 'unknown'
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = { Conversation, Message };
