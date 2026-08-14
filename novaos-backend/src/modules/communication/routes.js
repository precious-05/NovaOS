const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage } = require('./controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');

router.use(authMiddleware);

router.get('/conversations', getConversations);
router.get('/conversations/:id/messages', getMessages);
router.post('/send', sendMessage);

module.exports = router;