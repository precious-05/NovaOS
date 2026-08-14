const { Conversation, Message } = require('./model');
const { validateSendMessage } = require('./validator');

const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ companyId: req.user.companyId })
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Conversations fetched successfully',
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;

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

    const messages = await Message.find({ conversationId: id }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      data: { messages }
    });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;

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
      sender: 'ai',
      text
    });

    conversation.lastMessageAt = Date.now();
    await conversation.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getConversations, getMessages, sendMessage };