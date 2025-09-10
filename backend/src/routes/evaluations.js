const express = require('express');
const router = express.Router();
const {
  getAllEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getStudentEvaluations,
  getEvaluatorEvaluations,
  getEvaluationStats
} = require('../controllers/evaluationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all evaluations (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), getAllEvaluations);

// Get evaluation by ID
router.get('/:id', authenticateToken, getEvaluationById);

// Create new evaluation (Mentor, Supervisor, Admin)
router.post('/', authenticateToken, requireRole(['mentor', 'supervisor', 'admin']), createEvaluation);

// Update evaluation (Mentor, Supervisor, Admin)
router.put('/:id', authenticateToken, requireRole(['mentor', 'supervisor', 'admin']), updateEvaluation);

// Delete evaluation (Admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteEvaluation);

// Get student's evaluations
router.get('/student/:studentId', authenticateToken, getStudentEvaluations);

// Get evaluator's evaluations
router.get('/evaluator/:evaluatorId', authenticateToken, requireRole(['mentor', 'supervisor', 'admin']), getEvaluatorEvaluations);

// Get evaluation statistics for a student
router.get('/stats/:studentId', authenticateToken, getEvaluationStats);

module.exports = router;
