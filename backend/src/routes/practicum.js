const express = require('express');
const {
  getAllPracticumRecords,
  getPracticumRecordById,
  createPracticumRecord,
  updatePracticumRecord,
  approvePracticumRecord,
  rejectPracticumRecord,
  deletePracticumRecord,
  getStudentPracticumSummary
} = require('../controllers/practicumController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all practicum records
router.get('/', requireRole(['admin', 'student', 'mentor', 'supervisor']), getAllPracticumRecords);

// Get practicum record by ID
router.get('/:id', requireRole(['admin', 'student', 'mentor', 'supervisor']), getPracticumRecordById);

// Create new practicum record (Students can create their own records)
router.post('/', requireRole(['admin', 'student']), createPracticumRecord);

// Update practicum record (Students can update their own records, admins can update any)
router.put('/:id', requireRole(['admin', 'student']), updatePracticumRecord);

// Approve practicum record (Mentors and supervisors only)
router.put('/:id/approve', requireRole(['mentor', 'supervisor']), approvePracticumRecord);

// Reject practicum record (Mentors and supervisors only)
router.put('/:id/reject', requireRole(['mentor', 'supervisor']), rejectPracticumRecord);

// Delete practicum record (Students can delete their own records, admins can delete any)
router.delete('/:id', requireRole(['admin', 'student']), deletePracticumRecord);

// Get student's practicum summary
router.get('/summary/:studentId', requireRole(['admin', 'student', 'mentor', 'supervisor']), getStudentPracticumSummary);

module.exports = router;
