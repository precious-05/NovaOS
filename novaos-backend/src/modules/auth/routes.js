const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('./controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;