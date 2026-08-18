const express = require('express');
const router = express.Router();
const { 
  getConversations, 
  createConversation,
  getMessages, 
  sendMessage,
  sendEmail,                    // ← ADDED
  getConversationsByChannel     // ← ADDED
} = require('./controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// ===== CONVERSATION ROUTES =====
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/channel/:channel', getConversationsByChannel);  // ← ADDED

// ===== MESSAGE ROUTES =====
router.get('/conversations/:id/messages', getMessages);
router.post('/send', sendMessage);
router.post('/send-email', sendEmail);  // ← ADDED

module.exports = router;