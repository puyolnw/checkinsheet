const { pool } = require('../config/database');

// Get conversations for a user
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Get conversations where user is either sender or receiver
    const query = `
      SELECT DISTINCT
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id
          ELSE m.sender_id
        END as other_user_id,
        u.first_name as other_user_first_name,
        u.last_name as other_user_last_name,
        u.role_name as other_user_role,
        m.content as last_message,
        m.created_at as last_message_time,
        m.is_read as last_message_read,
        COUNT(CASE WHEN m.receiver_id = ? AND m.is_read = 0 THEN 1 END) as unread_count
      FROM messages m
      JOIN users u ON (
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id
          ELSE m.sender_id
        END = u.id
      )
      WHERE m.sender_id = ? OR m.receiver_id = ?
      GROUP BY other_user_id, u.first_name, u.last_name, u.role_name, m.content, m.created_at, m.is_read
      ORDER BY last_message_time DESC
      LIMIT ? OFFSET ?
    `;

    const [conversations] = await pool.execute(query, [
      userId, userId, userId, userId, userId, parseInt(limit), offset
    ]);

    res.json({
      success: true,
      data: conversations
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // Get messages between the two users
    const query = `
      SELECT 
        m.*,
        sender.first_name as sender_first_name,
        sender.last_name as sender_last_name,
        receiver.first_name as receiver_first_name,
        receiver.last_name as receiver_last_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) 
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
      LIMIT ? OFFSET ?
    `;

    const [messages] = await pool.execute(query, [
      userId, otherUserId, otherUserId, userId, parseInt(limit), offset
    ]);

    // Mark messages as read
    await pool.execute(
      'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
      [otherUserId, userId]
    );

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiver_id, content, message_type = 'text' } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and content are required'
      });
    }

    const query = `
      INSERT INTO messages (sender_id, receiver_id, content, message_type)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [sender_id, receiver_id, content, message_type]);

    // Get the created message with user details
    const messageQuery = `
      SELECT 
        m.*,
        sender.first_name as sender_first_name,
        sender.last_name as sender_last_name,
        receiver.first_name as receiver_first_name,
        receiver.last_name as receiver_last_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.id = ?
    `;

    const [messages] = await pool.execute(messageQuery, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: messages[0]
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.id;

    await pool.execute(
      'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
      [otherUserId, userId]
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Check if user is the sender of the message
    const [messages] = await pool.execute(
      'SELECT sender_id FROM messages WHERE id = ?',
      [messageId]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (messages[0].sender_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    await pool.execute('DELETE FROM messages WHERE id = ?', [messageId]);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT COUNT(*) as unread_count
      FROM messages
      WHERE receiver_id = ? AND is_read = 0
    `;

    const [result] = await pool.execute(query, [userId]);

    res.json({
      success: true,
      data: { unread_count: result[0].unread_count }
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};

// Get message statistics
const getMessageStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN sender_id = ? THEN 1 END) as sent_messages,
        COUNT(CASE WHEN receiver_id = ? THEN 1 END) as received_messages,
        COUNT(CASE WHEN receiver_id = ? AND is_read = 0 THEN 1 END) as unread_messages,
        COUNT(DISTINCT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END) as conversation_count
      FROM messages
      WHERE sender_id = ? OR receiver_id = ?
    `;

    const [stats] = await pool.execute(query, [
      userId, userId, userId, userId, userId, userId
    ]);

    res.json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get message statistics'
    });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  getUnreadCount,
  getMessageStats
};
