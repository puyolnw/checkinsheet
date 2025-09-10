const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  getSystemOverview,
  getPracticumProgressReport,
  getEvaluationSummaryReport,
  getStudentPerformanceReport,
  exportReport
} = require('../controllers/reportController');

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(['admin']));

// System overview report
router.get('/system-overview', getSystemOverview);

// Practicum progress report
router.get('/practicum-progress', getPracticumProgressReport);

// Evaluation summary report
router.get('/evaluation-summary', getEvaluationSummaryReport);

// Student performance report
router.get('/student-performance', getStudentPerformanceReport);

// Export report
router.post('/export', exportReport);

module.exports = router;