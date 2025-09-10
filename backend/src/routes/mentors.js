const express = require('express');
const {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
  getMentorStudents,
  getMentorEvaluations,
  getSubjectSpecialties
} = require('../controllers/mentorController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all mentors
router.get('/', requireRole(['admin', 'supervisor', 'mentor']), getAllMentors);

// Get mentor by ID
router.get('/:id', requireRole(['admin', 'mentor', 'supervisor']), getMentorById);

// Create new mentor (Admin only)
router.post('/', requireRole(['admin']), createMentor);

// Update mentor (Admin only)
router.put('/:id', requireRole(['admin']), updateMentor);

// Delete mentor (Admin only)
router.delete('/:id', requireRole(['admin']), deleteMentor);

// Get mentor's students
router.get('/:id/students', requireRole(['admin', 'mentor', 'supervisor']), getMentorStudents);

// Get mentor's evaluations
router.get('/:id/evaluations', requireRole(['admin', 'mentor', 'supervisor']), getMentorEvaluations);

// Get subject specialties for filter
router.get('/filters/specialties', requireRole(['admin', 'supervisor', 'mentor']), getSubjectSpecialties);

module.exports = router;
