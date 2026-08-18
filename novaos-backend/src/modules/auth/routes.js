const express = require('express');
const router = express.Router();
const authMiddleware = require('../../shared/middleware/authMiddleware');

// ===== IMPORT AUTH CONTROLLER FUNCTIONS =====
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword   // ← ADDED: For Settings page
} = require('./controller');

// =============================================
// ===== PUBLIC ROUTES (No Auth Required) =====
// =============================================
router.post('/register', register);
router.post('/login', login);

// =============================================
// ===== PROTECTED ROUTES (Auth Required) =====
// =============================================
router.get('/me', authMiddleware, getMe);
router.put('/update', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);  // ← ADDED

module.exports = router;
