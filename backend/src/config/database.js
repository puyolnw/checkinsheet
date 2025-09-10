const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'student_practicum_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Removed acquireTimeout and reconnect to avoid MySQL2 warnings
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database connection
const initDatabase = async () => {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('Retrying database connection in 5 seconds...');
    setTimeout(initDatabase, 5000);
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase
};
