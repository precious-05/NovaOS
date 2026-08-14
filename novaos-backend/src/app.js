const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// ===== IMPORT ALL ROUTES =====
const authRoutes = require('./modules/auth/routes');
const salesRoutes = require('./modules/sales/routes');        // ← Your route (Member 3)
const productivityRoutes = require('./modules/productivity/routes'); // ← Member 4's route
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
app.use('/api/auth', authRoutes);                 // Member 1 - Auth
app.use('/api/sales', salesRoutes);               // Member 3 - Sales (Your work)
app.use('/api/productivity', productivityRoutes); // Member 4 - Productivity

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'NovaOS API is running' });
});

app.use(errorHandler);

module.exports = app;