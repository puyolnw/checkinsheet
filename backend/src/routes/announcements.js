const express = require('express');
const router = express.Router();
const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
  getAnnouncementCategories,
  getAnnouncementStats
} = require('../controllers/announcementController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get active announcements (public)
router.get('/active', getActiveAnnouncements);

// Get announcement categories (public)
router.get('/categories', getAnnouncementCategories);

// Get all announcements (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), getAllAnnouncements);

// Get announcement by ID
router.get('/:id', authenticateToken, getAnnouncementById);

// Create new announcement (Admin, Supervisor)
router.post('/', authenticateToken, requireRole(['admin', 'supervisor']), createAnnouncement);

// Update announcement (Admin, Supervisor)
router.put('/:id', authenticateToken, requireRole(['admin', 'supervisor']), updateAnnouncement);

// Delete announcement (Admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteAnnouncement);

// Get announcement statistics (Admin only)
router.get('/stats/overview', authenticateToken, requireRole(['admin']), getAnnouncementStats);

module.exports = router;
