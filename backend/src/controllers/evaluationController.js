const { pool } = require('../config/database');

// Get all evaluations with pagination and filters
const getAllEvaluations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, evaluator_type, evaluation_type, student_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ` AND (s.student_id LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (evaluator_type) {
      whereClause += ` AND e.evaluator_type = ?`;
      params.push(evaluator_type);
    }

    if (evaluation_type) {
      whereClause += ` AND e.evaluation_type = ?`;
      params.push(evaluation_type);
    }

    if (student_id) {
      whereClause += ` AND e.student_id = ?`;
      params.push(student_id);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM evaluations e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get evaluations with pagination
    const evaluationsQuery = `
      SELECT 
        e.*,
        s.student_id as student_code,
        CONCAT(u.first_name, ' ', u.last_name) as student_name,
        CONCAT(ev.first_name, ' ', ev.last_name) as evaluator_name,
        ur.role_name as evaluator_role
      FROM evaluations e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN users ev ON e.evaluator_id = ev.id
      LEFT JOIN user_roles ur ON ev.role_id = ur.id
      ${whereClause}
      ORDER BY e.evaluation_date DESC, e.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [evaluations] = await pool.execute(evaluationsQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: evaluations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all evaluations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluations'
    });
  }
};

// Get evaluation by ID
const getEvaluationById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        e.*,
        s.student_id,
        u.first_name as student_first_name,
        u.last_name as student_last_name,
        ev.first_name as evaluator_first_name,
        ev.last_name as evaluator_last_name,
        ev.role_name as evaluator_role
      FROM evaluations e
      JOIN students s ON e.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN users ev ON e.evaluator_id = ev.id
      WHERE e.id = ?
    `;

    const [evaluations] = await pool.execute(query, [id]);

    if (evaluations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evaluation not found'
      });
    }

    res.json({
      success: true,
      data: evaluations[0]
    });

  } catch (error) {
    console.error('Get evaluation by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluation'
    });
  }
};

// Create new evaluation
const createEvaluation = async (req, res) => {
  try {
    const {
      student_id,
      evaluator_id,
      evaluator_type,
      evaluation_type,
      evaluation_date,
      teaching_preparation,
      classroom_management,
      content_knowledge,
      teaching_methods,
      student_interaction,
      assessment_evaluation,
      professional_ethics,
      punctuality_attendance,
      communication_skills,
      adaptability,
      strengths,
      weaknesses,
      recommendations,
      overall_feedback
    } = req.body;

    // Calculate total score
    const scores = [
      teaching_preparation,
      classroom_management,
      content_knowledge,
      teaching_methods,
      student_interaction,
      assessment_evaluation,
      professional_ethics,
      punctuality_attendance,
      communication_skills,
      adaptability
    ].filter(score => score !== null && score !== undefined);

    const totalScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) : 0;
    const averageScore = scores.length > 0 ? totalScore / scores.length : 0;

    // Determine grade based on average score
    let grade;
    if (averageScore >= 4.5) grade = 'A';
    else if (averageScore >= 3.5) grade = 'B';
    else if (averageScore >= 2.5) grade = 'C';
    else if (averageScore >= 1.5) grade = 'D';
    else grade = 'F';

    const query = `
      INSERT INTO evaluations (
        student_id, evaluator_id, evaluator_type, evaluation_type, evaluation_date,
        teaching_preparation, classroom_management, content_knowledge, teaching_methods,
        student_interaction, assessment_evaluation, professional_ethics, punctuality_attendance,
        communication_skills, adaptability, total_score, grade,
        strengths, weaknesses, recommendations, overall_feedback
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      student_id, evaluator_id, evaluator_type, evaluation_type, evaluation_date,
      teaching_preparation, classroom_management, content_knowledge, teaching_methods,
      student_interaction, assessment_evaluation, professional_ethics, punctuality_attendance,
      communication_skills, adaptability, totalScore, grade,
      strengths, weaknesses, recommendations, overall_feedback
    ]);

    res.status(201).json({
      success: true,
      message: 'Evaluation created successfully',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Create evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create evaluation'
    });
  }
};

// Update evaluation
const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      evaluation_date,
      teaching_preparation,
      classroom_management,
      content_knowledge,
      teaching_methods,
      student_interaction,
      assessment_evaluation,
      professional_ethics,
      punctuality_attendance,
      communication_skills,
      adaptability,
      strengths,
      weaknesses,
      recommendations,
      overall_feedback
    } = req.body;

    // Calculate total score
    const scores = [
      teaching_preparation,
      classroom_management,
      content_knowledge,
      teaching_methods,
      student_interaction,
      assessment_evaluation,
      professional_ethics,
      punctuality_attendance,
      communication_skills,
      adaptability
    ].filter(score => score !== null && score !== undefined);

    const totalScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) : 0;
    const averageScore = scores.length > 0 ? totalScore / scores.length : 0;

    // Determine grade based on average score
    let grade;
    if (averageScore >= 4.5) grade = 'A';
    else if (averageScore >= 3.5) grade = 'B';
    else if (averageScore >= 2.5) grade = 'C';
    else if (averageScore >= 1.5) grade = 'D';
    else grade = 'F';

    const query = `
      UPDATE evaluations 
      SET evaluation_date = ?, teaching_preparation = ?, classroom_management = ?,
          content_knowledge = ?, teaching_methods = ?, student_interaction = ?,
          assessment_evaluation = ?, professional_ethics = ?, punctuality_attendance = ?,
          communication_skills = ?, adaptability = ?, total_score = ?, grade = ?,
          strengths = ?, weaknesses = ?, recommendations = ?, overall_feedback = ?,
          updated_at = NOW()
      WHERE id = ?
    `;

    await pool.execute(query, [
      evaluation_date, teaching_preparation, classroom_management,
      content_knowledge, teaching_methods, student_interaction,
      assessment_evaluation, professional_ethics, punctuality_attendance,
      communication_skills, adaptability, totalScore, grade,
      strengths, weaknesses, recommendations, overall_feedback, id
    ]);

    res.json({
      success: true,
      message: 'Evaluation updated successfully'
    });

  } catch (error) {
    console.error('Update evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update evaluation'
    });
  }
};

// Delete evaluation
const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM evaluations WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Evaluation deleted successfully'
    });

  } catch (error) {
    console.error('Delete evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete evaluation'
    });
  }
};

// Get student's evaluations
const getStudentEvaluations = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM evaluations WHERE student_id = ?';
    const [countResult] = await pool.execute(countQuery, [studentId]);
    const total = countResult[0].total;

    // Get evaluations
    const evaluationsQuery = `
      SELECT 
        e.*,
        ev.first_name as evaluator_first_name,
        ev.last_name as evaluator_last_name,
        ev.role_name as evaluator_role
      FROM evaluations e
      JOIN users ev ON e.evaluator_id = ev.id
      WHERE e.student_id = ?
      ORDER BY e.evaluation_date DESC
      LIMIT ? OFFSET ?
    `;

    const [evaluations] = await pool.execute(evaluationsQuery, [studentId, parseInt(limit), offset]);

    res.json({
      success: true,
      data: evaluations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get student evaluations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student evaluations'
    });
  }
};

// Get evaluator's evaluations
const getEvaluatorEvaluations = async (req, res) => {
  try {
    const { evaluatorId } = req.params;
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    const userRole = req.user.role_name;
    const userId = req.user.id;

    // สำหรับ mentors และ supervisors ให้ดูเฉพาะข้อมูลของตนเอง
    if ((userRole === 'mentor' || userRole === 'supervisor') && userId.toString() !== evaluatorId) {
      return res.status(403).json({
        success: false,
        message: 'ไม่สามารถเข้าถึงข้อมูลของผู้อื่นได้'
      });
    }

    let whereClause = 'WHERE e.evaluator_id = ?';
    const params = [evaluatorId];

    if (search) {
      whereClause += ` AND (s.student_id LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM evaluations e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get evaluations
    const evaluationsQuery = `
      SELECT 
        e.*,
        s.student_id as student_code,
        CONCAT(u.first_name, ' ', u.last_name) as student_name,
        CONCAT(eu.first_name, ' ', eu.last_name) as evaluator_name,
        ur.role_name as evaluator_role
      FROM evaluations e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN users eu ON e.evaluator_id = eu.id
      LEFT JOIN user_roles ur ON eu.role_id = ur.id
      ${whereClause}
      ORDER BY e.evaluation_date DESC
      LIMIT ? OFFSET ?
    `;

    const [evaluations] = await pool.execute(evaluationsQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: evaluations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get evaluator evaluations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluator evaluations'
    });
  }
};

// Get evaluation statistics
const getEvaluationStats = async (req, res) => {
  try {
    const { studentId } = req.params;

    const query = `
      SELECT 
        COUNT(*) as total_evaluations,
        AVG(total_score) as average_score,
        COUNT(CASE WHEN grade = 'A' THEN 1 END) as grade_a_count,
        COUNT(CASE WHEN grade = 'B' THEN 1 END) as grade_b_count,
        COUNT(CASE WHEN grade = 'C' THEN 1 END) as grade_c_count,
        COUNT(CASE WHEN grade = 'D' THEN 1 END) as grade_d_count,
        COUNT(CASE WHEN grade = 'F' THEN 1 END) as grade_f_count,
        COUNT(CASE WHEN evaluator_type = 'mentor' THEN 1 END) as mentor_evaluations,
        COUNT(CASE WHEN evaluator_type = 'supervisor' THEN 1 END) as supervisor_evaluations
      FROM evaluations 
      WHERE student_id = ?
    `;

    const [stats] = await pool.execute(query, [studentId]);

    res.json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error('Get evaluation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluation statistics'
    });
  }
};

module.exports = {
  getAllEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getStudentEvaluations,
  getEvaluatorEvaluations,
  getEvaluationStats
};
