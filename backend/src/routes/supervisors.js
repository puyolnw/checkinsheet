const express = require('express');
const {
  getAllSupervisors,
  getSupervisorById,
  createSupervisor,
  updateSupervisor,
  deleteSupervisor,
  getSupervisorStudents,
  getSupervisorEvaluations,
  getDepartments,
  getAcademicRanks
} = require('../controllers/supervisorController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all supervisors
router.get('/', requireRole(['admin', 'supervisor']), getAllSupervisors);

// Get supervisor by ID
router.get('/:id', requireRole(['admin', 'mentor', 'supervisor']), getSupervisorById);

// Create new supervisor (Admin only)
router.post('/', requireRole(['admin']), createSupervisor);

// Update supervisor (Admin only)
router.put('/:id', requireRole(['admin']), updateSupervisor);

// Delete supervisor (Admin only)
router.delete('/:id', requireRole(['admin']), deleteSupervisor);

// Get supervisor's students
router.get('/:id/students', requireRole(['admin', 'mentor', 'supervisor']), getSupervisorStudents);

// Get supervisor's evaluations
router.get('/:id/evaluations', requireRole(['admin', 'mentor', 'supervisor']), getSupervisorEvaluations);

// Get departments for filter
router.get('/filters/departments', requireRole(['admin', 'supervisor']), getDepartments);

// Get academic ranks for filter
router.get('/filters/ranks', requireRole(['admin', 'supervisor']), getAcademicRanks);

module.exports = router;
