// src/modules/reporting/routes.js
const express = require('express');
const router = express.Router();
const reportingController = require('./controller');
const authMiddleware = require('../../shared/middleware/authMiddleware');

// All reporting routes require authentication
router.get('/summary', authMiddleware, reportingController.getSummary);
router.get('/sales', authMiddleware, reportingController.getSalesReport);
router.get('/productivity', authMiddleware, reportingController.getProductivityReport);
router.get('/communication', authMiddleware, reportingController.getCommunicationReport);

module.exports = router;