const express = require('express');
const router = express.Router();
const {
  getAllLessonPlans,
  getLessonPlanById,
  createLessonPlan,
  updateLessonPlan,
  submitLessonPlan,
  approveLessonPlan,
  rejectLessonPlan,
  deleteLessonPlan,
  getStudentLessonPlans,
  getMentorLessonPlans,
  getLessonPlanStats
} = require('../controllers/lessonPlanController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all lesson plans (Admin, Supervisor)
router.get('/', authenticateToken, requireRole(['admin', 'supervisor']), getAllLessonPlans);

// Get lesson plan by ID
router.get('/:id', authenticateToken, getLessonPlanById);

// Create new lesson plan (Student)
router.post('/', authenticateToken, requireRole(['student']), createLessonPlan);

// Update lesson plan (Student - only if draft)
router.put('/:id', authenticateToken, requireRole(['student']), updateLessonPlan);

// Submit lesson plan for review (Student)
router.put('/:id/submit', authenticateToken, requireRole(['student']), submitLessonPlan);

// Approve lesson plan (Mentor, Supervisor)
router.put('/:id/approve', authenticateToken, requireRole(['mentor', 'supervisor']), approveLessonPlan);

// Reject lesson plan (Mentor, Supervisor)
router.put('/:id/reject', authenticateToken, requireRole(['mentor', 'supervisor']), rejectLessonPlan);

// Delete lesson plan (Student - only if draft, Admin)
router.delete('/:id', authenticateToken, requireRole(['student', 'admin']), deleteLessonPlan);

// Get student's lesson plans
router.get('/student/:studentId', authenticateToken, getStudentLessonPlans);

// Get mentor's lesson plans to review
router.get('/mentor/:mentorId', authenticateToken, requireRole(['mentor', 'admin']), getMentorLessonPlans);

// Get lesson plan statistics
router.get('/stats/:studentId', authenticateToken, getLessonPlanStats);

module.exports = router;
