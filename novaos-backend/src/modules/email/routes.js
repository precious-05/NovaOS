const express = require('express');
const router = express.Router();
const { fetchNewEmails, getEmails, summarizeEmail, replyToEmail } = require('./controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');

router.use(authMiddleware);

router.get('/fetch', fetchNewEmails);
router.get('/', getEmails);
router.post('/:id/summarize', summarizeEmail);
router.post('/:id/reply', replyToEmail);

module.exports = router;