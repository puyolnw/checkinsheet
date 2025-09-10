const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// Suppress dotenv output
const originalLog = console.log;
console.log = (...args) => {
  if (!args[0]?.includes?.('[dotenv@')) {
    originalLog(...args);
  }
};
require('dotenv').config();

const { initDatabase } = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Student Practicum System API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/students', require('./src/routes/students'));
app.use('/api/schools', require('./src/routes/schools'));
app.use('/api/mentors', require('./src/routes/mentors'));
app.use('/api/supervisors', require('./src/routes/supervisors'));
app.use('/api/practicum-records', require('./src/routes/practicum'));
app.use('/api/evaluations', require('./src/routes/evaluations'));
app.use('/api/announcements', require('./src/routes/announcements'));
app.use('/api/messages', require('./src/routes/messages'));
app.use('/api/lesson-plans', require('./src/routes/lessonPlans'));
app.use('/api/reports', require('./src/routes/reports'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
