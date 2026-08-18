const express = require('express');
const router = express.Router();
const authMiddleware = require('../../shared/middleware/authMiddleware');

const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getQuotations,
  createQuotation,
  deleteQuotation,      // ← ADDED
  updateQuotation,      // ← ADDED
  getInvoices,
  createInvoice,
  updateInvoiceStatus
} = require('./controller');

// All routes are protected with auth
router.use(authMiddleware);

// ===== CUSTOMER ROUTES =====
router.get('/customers', getCustomers);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

// ===== QUOTATION ROUTES =====
router.get('/quotations', getQuotations);
router.post('/quotations', createQuotation);
router.put('/quotations/:id', updateQuotation);    // ← ADDED
router.delete('/quotations/:id', deleteQuotation); // ← ADDED

// ===== INVOICE ROUTES =====
router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);
router.patch('/invoices/:id/status', updateInvoiceStatus);

module.exports = router;