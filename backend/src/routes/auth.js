const express = require('express');
const { login, getProfile, logout, changePassword, registerStudent } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register-student', registerStudent);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
