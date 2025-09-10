const express = require('express');
const {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolStudents,
  getSchoolMentors,
  getProvinces,
  getSchoolTypes
} = require('../controllers/schoolController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all schools
router.get('/', requireRole(['admin', 'mentor', 'supervisor']), getAllSchools);

// Get school by ID
router.get('/:id', requireRole(['admin', 'mentor', 'supervisor']), getSchoolById);

// Create new school (Admin only)
router.post('/', requireRole(['admin']), createSchool);

// Update school (Admin only)
router.put('/:id', requireRole(['admin']), updateSchool);

// Delete school (Admin only)
router.delete('/:id', requireRole(['admin']), deleteSchool);

// Get school's students
router.get('/:id/students', requireRole(['admin', 'mentor', 'supervisor']), getSchoolStudents);

// Get school's mentors
router.get('/:id/mentors', requireRole(['admin', 'mentor', 'supervisor']), getSchoolMentors);

// Get provinces for filter
router.get('/filters/provinces', requireRole(['admin', 'mentor', 'supervisor']), getProvinces);

// Get school types for filter
router.get('/filters/types', requireRole(['admin', 'mentor', 'supervisor']), getSchoolTypes);

module.exports = router;
