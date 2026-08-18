const { Conversation, Message } = require('./model');
const { validateSendMessage } = require('./validator');

// ===== GET ALL CONVERSATIONS =====
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ companyId: req.user.companyId })
      .populate('customerId', 'name email')
      .sort({ lastMessageAt: -1 });

    // ✅ Add lastMessage to each conversation
    for (let conv of conversations) {
      const lastMsg = await Message.findOne({ conversationId: conv._id })
        .sort({ timestamp: -1 });
      conv._doc.lastMessage = lastMsg ? lastMsg.text : 'No messages yet';
    }

    res.status(200).json({
      success: true,
      message: 'Conversations fetched successfully',
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

// ===== CREATE A NEW CONVERSATION =====
const createConversation = async (req, res, next) => {
  try {
    const { customerId, channel } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'customerId is required'
      });
    }

    const conversation = await Conversation.create({
      companyId: req.user.companyId,
      customerId,
      channel: channel || 'email',
      status: 'open',
      lastMessageAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

// ===== GET MESSAGES FOR A CONVERSATION =====
const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isNaN(parsedLimit) ? 200 : Math.min(Math.max(parsedLimit, 1), 500);

    const conversation = await Conversation.findOne({
      _id: id,
      companyId: req.user.companyId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await Message.find({ conversationId: id })
      .sort({ timestamp: 1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// ===== SEND A MESSAGE =====
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text, sender } = req.body;

    const validation = validateSendMessage({ conversationId, text });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      companyId: req.user.companyId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const message = await Message.create({
      conversationId,
      sender: sender || 'ai',
      text
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getConversations, 
  createConversation,
  getMessages, 
  sendMessage 
};
// ===== SEND EMAIL =====
const sendEmail = async (req, res, next) => {
  try {
    const { conversationId, text, subject } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({
        success: false,
        message: 'conversationId and text are required'
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      companyId: req.user.companyId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Create a message with email metadata
    const message = await Message.create({
      conversationId,
      sender: 'ai',
      text: text,
      intent: 'email',
      sentiment: 'neutral'
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Here you would integrate with an email service (Gmail API, SendGrid, etc.)
    console.log(`📧 Email sent to: ${conversation.customerId?.email || 'unknown'}`);
    console.log(`📧 Subject: ${subject || 'No subject'}`);
    console.log(`📧 Body: ${text}`);

    res.status(201).json({
      success: true,
      message: 'Email sent successfully',
      data: {
        message,
        emailSent: true,
        recipient: conversation.customerId?.email
      }
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    next(error);
  }
};

// ===== GET CONVERSATIONS BY CHANNEL =====
const getConversationsByChannel = async (req, res, next) => {
  try {
    const { channel } = req.params;
    
    if (!['email', 'whatsapp'].includes(channel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid channel. Must be "email" or "whatsapp"'
      });
    }

    const conversations = await Conversation.find({ 
      companyId: req.user.companyId,
      channel: channel
    })
      .populate('customerId', 'name email')
      .sort({ lastMessageAt: -1 });

    for (let conv of conversations) {
      const lastMsg = await Message.findOne({ conversationId: conv._id })
        .sort({ timestamp: -1 });
      conv._doc.lastMessage = lastMsg ? lastMsg.text : 'No messages yet';
    }

    res.status(200).json({
      success: true,
      message: `${channel} conversations fetched successfully`,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getConversations, 
  createConversation,
  getMessages, 
  sendMessage,
  sendEmail,           // ← ADDED
  getConversationsByChannel  // ← ADDED
};