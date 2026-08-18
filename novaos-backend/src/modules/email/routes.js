const express = require('express');
const router = express.Router();
const { fetchNewEmails, getEmails, summarizeEmail, replyToEmail } = require('./controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');

// TEMPORARY - testing ke liye, bina auth ke (baad me delete karna hai)
router.get('/test-fetch', fetchNewEmails);
router.post('/test-summarize/:id', summarizeEmail);
router.post('/test-reply/:id', replyToEmail);

router.use(authMiddleware);

router.get('/fetch', fetchNewEmails);
router.get('/', getEmails);
router.post('/:id/summarize', summarizeEmail);
router.post('/:id/reply', replyToEmail);

module.exports = router;