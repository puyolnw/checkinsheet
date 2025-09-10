const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  getUnreadCount,
  getMessageStats
} = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');

// Get conversations for authenticated user
router.get('/conversations', authenticateToken, getConversations);

// Get messages between two users
router.get('/:otherUserId', authenticateToken, getMessages);

// Send a message
router.post('/', authenticateToken, sendMessage);

// Mark messages as read
router.put('/:otherUserId/read', authenticateToken, markAsRead);

// Delete a message
router.delete('/:messageId', authenticateToken, deleteMessage);

// Get unread message count
router.get('/unread/count', authenticateToken, getUnreadCount);

// Get message statistics
router.get('/stats/overview', authenticateToken, getMessageStats);

module.exports = router;
