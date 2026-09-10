const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

// MongoDB connection
const connectDB = require('./config/db.js');

const PORT = process.env.PORT || 5000;

// Instantiate Express Application
const app = express();

// Enable CORS for frontend applications
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// JSON header middleware
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Main API Router
app.use('/', require('./routes/router.js'));

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: 'Endpoint Not Found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);

  res.status(err.status || 500).json({
    status: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server only after MongoDB connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `🚀 WeProvision Backend Server listening on http://localhost:${PORT}`
      );

      console.log(
        `📡 API Endpoints available at http://localhost:${PORT}/api/health`
      );
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();