const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// ===== IMPORT ALL ROUTES =====
const authRoutes = require('./modules/auth/routes');
const salesRoutes = require('./modules/sales/routes');
const reportingRoutes = require('./modules/reporting/routes');
const productivityRoutes = require('./modules/productivity/routes');
const communicationRoutes = require('./modules/communication/routes');  // ← Member 2
const errorHandler = require('./shared/middleware/errorHandler');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', limiter);

// ===== REGISTER ALL ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);                 // Member 3
app.use('/api/reports', reportingRoutes);           // Member 5
app.use('/api/productivity', productivityRoutes);   // Member 4
app.use('/api/communication', communicationRoutes); // Member 2

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'NovaOS API is running' });
});

app.use(errorHandler);

module.exports = app;