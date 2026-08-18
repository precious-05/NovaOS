const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// ============ IMPORT ROUTES ============
const authRoutes = require('./src/modules/auth/routes');
const salesRoutes = require('./src/modules/sales/routes');
const reportingRoutes = require('./src/modules/reporting/routes');
const productivityRoutes = require('./src/modules/productivity/routes');
const communicationRoutes = require('./src/modules/communication/routes');
const webhookRoutes = require('./src/modules/communication/webhook.routes');
const emailRoutes = require('./src/modules/email/routes');

// ============ REGISTER ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportingRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/email', emailRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'NovaOS API Server',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
      update: 'PUT /api/auth/update',
      changePassword: 'PUT /api/auth/change-password',
      customers: 'GET/POST /api/sales/customers',
      customerUpdate: 'PUT /api/sales/customers/:id',
      customerDelete: 'DELETE /api/sales/customers/:id',
      quotations: 'GET/POST /api/sales/quotations',
      invoices: 'GET/POST /api/sales/invoices',
      invoiceStatus: 'PATCH /api/sales/invoices/:id/status',
      tasks: 'GET/POST /api/productivity/tasks',
      taskUpdate: 'PUT /api/productivity/tasks/:id',
      taskDelete: 'DELETE /api/productivity/tasks/:id',
      meetings: 'POST /api/productivity/meetings/transcribe',
      documents: 'POST /api/productivity/documents/upload',
      conversations: 'GET/POST /api/communication/conversations',
      messages: 'GET /api/communication/conversations/:id/messages',
      send: 'POST /api/communication/send',
      webhook: 'GET/POST /webhook',
      emails: 'GET /api/email',
      emailFetch: 'GET /api/email/fetch',
      summary: 'GET /api/reports/summary',
      sales: 'GET /api/reports/sales',
      productivity: 'GET /api/reports/productivity',
      communication: 'GET /api/reports/communication',
      test: 'GET /api/test'
    }
  });
});

const PORT = process.env.PORT || 5001;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/novaos_db')
  .then(() => {
    console.log('MongoDB Connected:', mongoose.connection.host);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 Routes registered:`);
      console.log(`   /api/auth - Auth routes`);
      console.log(`   /api/sales - Sales routes`);
      console.log(`   /api/reports - Reporting routes`);
      console.log(`   /api/productivity - Productivity routes`);
      console.log(`   /api/communication - Communication routes`);
      console.log(`   /webhook - WhatsApp webhook`);
      console.log(`   /api/email - Email routes`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });