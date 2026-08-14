// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const communicationRoutes = require('./src/modules/communication/routes'); // ← Member 2
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
const productivityRoutes = require('./src/modules/productivity/routes');  // ← ADD THIS

// ============ REGISTER ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportingRoutes);
app.use('/api/productivity', productivityRoutes);  // ← ADD THIS
app.use('/api/communication', communicationRoutes); // ← Member 2
// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'NovaOS API Server',
    endpoints: {
      // Auth endpoints
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
      update: 'PUT /api/auth/update',
      changePassword: 'PUT /api/auth/change-password',
      // Sales endpoints
      customers: 'GET/POST /api/sales/customers',
      customerUpdate: 'PUT /api/sales/customers/:id',
      customerDelete: 'DELETE /api/sales/customers/:id',
      quotations: 'GET/POST /api/sales/quotations',
      invoices: 'GET/POST /api/sales/invoices',
      invoiceStatus: 'PATCH /api/sales/invoices/:id/status',
      // Productivity endpoints (ADD THIS SECTION)
      tasks: 'GET/POST /api/productivity/tasks',
      taskUpdate: 'PUT /api/productivity/tasks/:id',
      taskDelete: 'DELETE /api/productivity/tasks/:id',
      meetings: 'POST /api/productivity/meetings/transcribe',
      documents: 'POST /api/productivity/documents/upload',
      // Reporting endpoints
      summary: 'GET /api/reports/summary',
      sales: 'GET /api/reports/sales',
      productivity: 'GET /api/reports/productivity',
      communication: 'GET /api/reports/communication',
      // Test
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
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });