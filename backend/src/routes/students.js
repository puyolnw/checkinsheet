const express = require('express');
const {
  getAllStudents,
  getStudentById,
  updateStudent,
  assignSchool,
  assignMentor,
  assignSupervisor,
  deleteStudent,
  getStudentPracticumRecords,
  getStudentsByMentor,
  getStudentsBySupervisor
} = require('../controllers/studentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all students (Admin, Mentor, Supervisor)
router.get('/', requireRole(['student', 'admin', 'mentor', 'supervisor']), getAllStudents);

// Get student by ID
router.get('/:id', requireRole(['student', 'admin', 'mentor', 'supervisor']), getStudentById);


// Update student (Admin only)
router.put('/:id', requireRole(['admin']), updateStudent);

// Assign school to student (Admin only)
router.put('/:id/assign-school', requireRole(['admin']), assignSchool);

// Assign mentor to student (Admin only)
router.put('/:id/assign-mentor', requireRole(['admin']), assignMentor);

// Assign supervisor to student (Admin only)
router.put('/:id/assign-supervisor', requireRole(['admin']), assignSupervisor);

// Delete student (Admin only)
router.delete('/:id', requireRole(['admin']), deleteStudent);

// Get student's practicum records
router.get('/:id/practicum-records', requireRole(['admin', 'mentor', 'supervisor']), getStudentPracticumRecords);

// Get students by mentor
router.get('/mentor/:mentorId', requireRole(['admin', 'mentor', 'supervisor']), getStudentsByMentor);

// Get students by supervisor
router.get('/supervisor/:supervisorId', requireRole(['admin', 'mentor', 'supervisor']), getStudentsBySupervisor);

module.exports = router;
