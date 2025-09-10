const { pool } = require('../config/database');

// Get all lesson plans with pagination and filters
const getAllLessonPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, student_id, subject, status, mentor_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ` AND (lp.title LIKE ? OR lp.subject LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (student_id) {
      whereClause += ` AND lp.student_id = ?`;
      params.push(student_id);
    }

    if (subject) {
      whereClause += ` AND lp.subject = ?`;
      params.push(subject);
    }

    if (status) {
      whereClause += ` AND lp.status = ?`;
      params.push(status);
    }

    if (mentor_id) {
      whereClause += ` AND lp.mentor_id = ?`;
      params.push(mentor_id);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM lesson_plans lp
      LEFT JOIN students s ON lp.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN users mu ON mt.user_id = mu.id
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get lesson plans with pagination
    const lessonPlansQuery = `
      SELECT 
        lp.*,
        s.student_id,
        u.first_name as student_first_name,
        u.last_name as student_last_name,
        mu.first_name as mentor_first_name,
        mu.last_name as mentor_last_name
      FROM lesson_plans lp
      LEFT JOIN students s ON lp.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN users mu ON mt.user_id = mu.id
      ${whereClause}
      ORDER BY lp.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [lessonPlans] = await pool.execute(lessonPlansQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: lessonPlans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all lesson plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson plans'
    });
  }
};

// Get lesson plan by ID
const getLessonPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        lp.*,
        s.student_id,
        u.first_name as student_first_name,
        u.last_name as student_last_name,
        mu.first_name as mentor_first_name,
        mu.last_name as mentor_last_name
      FROM lesson_plans lp
      LEFT JOIN students s ON lp.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN users mu ON mt.user_id = mu.id
      WHERE lp.id = ?
    `;

    const [lessonPlans] = await pool.execute(query, [id]);

    if (lessonPlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson plan not found'
      });
    }

    res.json({
      success: true,
      data: lessonPlans[0]
    });

  } catch (error) {
    console.error('Get lesson plan by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson plan'
    });
  }
};

// Create new lesson plan
const createLessonPlan = async (req, res) => {
  try {
    const {
      student_id,
      title,
      subject,
      grade_level,
      lesson_date,
      duration_minutes,
      learning_objectives,
      materials_needed,
      lesson_activities,
      assessment_methods,
      homework_assignment,
      notes,
      mentor_id
    } = req.body;

    const query = `
      INSERT INTO lesson_plans (
        student_id, title, subject, grade_level, lesson_date, duration_minutes,
        learning_objectives, materials_needed, lesson_activities, assessment_methods,
        homework_assignment, notes, mentor_id, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')
    `;

    const [result] = await pool.execute(query, [
      student_id, title, subject, grade_level, lesson_date, duration_minutes,
      learning_objectives, materials_needed, lesson_activities, assessment_methods,
      homework_assignment, notes, mentor_id
    ]);

    res.status(201).json({
      success: true,
      message: 'Lesson plan created successfully',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Create lesson plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lesson plan'
    });
  }
};

// Update lesson plan
const updateLessonPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subject,
      grade_level,
      lesson_date,
      duration_minutes,
      learning_objectives,
      materials_needed,
      lesson_activities,
      assessment_methods,
      homework_assignment,
      notes
    } = req.body;

    const query = `
      UPDATE lesson_plans 
      SET title = ?, subject = ?, grade_level = ?, lesson_date = ?, 
          duration_minutes = ?, learning_objectives = ?, materials_needed = ?,
          lesson_activities = ?, assessment_methods = ?, homework_assignment = ?,
          notes = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await pool.execute(query, [
      title, subject, grade_level, lesson_date, duration_minutes,
      learning_objectives, materials_needed, lesson_activities,
      assessment_methods, homework_assignment, notes, id
    ]);

    res.json({
      success: true,
      message: 'Lesson plan updated successfully'
    });

  } catch (error) {
    console.error('Update lesson plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson plan'
    });
  }
};

// Submit lesson plan for review
const submitLessonPlan = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'UPDATE lesson_plans SET status = ?, submitted_at = NOW(), updated_at = NOW() WHERE id = ?',
      ['submitted', id]
    );

    res.json({
      success: true,
      message: 'Lesson plan submitted for review'
    });

  } catch (error) {
    console.error('Submit lesson plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit lesson plan'
    });
  }
};

// Approve lesson plan
const approveLessonPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    await pool.execute(
      'UPDATE lesson_plans SET status = ?, mentor_feedback = ?, approved_at = NOW(), updated_at = NOW() WHERE id = ?',
      ['approved', feedback, id]
    );

    res.json({
      success: true,
      message: 'Lesson plan approved'
    });

  } catch (error) {
    console.error('Approve lesson plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve lesson plan'
    });
  }
};

// Reject lesson plan
const rejectLessonPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    await pool.execute(
      'UPDATE lesson_plans SET status = ?, mentor_feedback = ?, rejected_at = NOW(), updated_at = NOW() WHERE id = ?',
      ['rejected', feedback, id]
    );

    res.json({
      success: true,
      message: 'Lesson plan rejected'
    });

  } catch (error) {
    console.error('Reject lesson plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject lesson plan'
    });
  }
};

// Delete lesson plan
const deleteLessonPlan = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM lesson_plans WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Lesson plan deleted successfully'
    });

  } catch (error) {
    console.error('Delete lesson plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lesson plan'
    });
  }
};

// Get student's lesson plans
const getStudentLessonPlans = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE lp.student_id = ?';
    const params = [studentId];

    if (status) {
      whereClause += ' AND lp.status = ?';
      params.push(status);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM lesson_plans lp ${whereClause}`;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get lesson plans
    const lessonPlansQuery = `
      SELECT 
        lp.*,
        mu.first_name as mentor_first_name,
        mu.last_name as mentor_last_name
      FROM lesson_plans lp
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN users mu ON mt.user_id = mu.id
      ${whereClause}
      ORDER BY lp.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [lessonPlans] = await pool.execute(lessonPlansQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: lessonPlans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get student lesson plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student lesson plans'
    });
  }
};

// Get mentor's lesson plans to review
const getMentorLessonPlans = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    // Get students assigned to this mentor
    const studentsQuery = `SELECT id FROM students WHERE assigned_mentor_id = ?`;
    const [students] = await pool.execute(studentsQuery, [mentorId]);
    const studentIds = students.map(s => s.id);
    
    if (studentIds.length === 0) {
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      });
    }

    let whereClause = `WHERE lp.student_id IN (${studentIds.map(() => '?').join(',')})`;
    const params = [...studentIds];

    if (status) {
      whereClause += ' AND lp.status = ?';
      params.push(status);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM lesson_plans lp ${whereClause}`;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get lesson plans
    const lessonPlansQuery = `
      SELECT 
        lp.*,
        s.student_id,
        u.first_name as student_first_name,
        u.last_name as student_last_name
      FROM lesson_plans lp
      LEFT JOIN students s ON lp.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      ${whereClause}
      ORDER BY lp.submitted_at DESC, lp.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [lessonPlans] = await pool.execute(lessonPlansQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: lessonPlans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get mentor lesson plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor lesson plans'
    });
  }
};

// Get lesson plan statistics
const getLessonPlanStats = async (req, res) => {
  try {
    const { studentId } = req.params;

    const query = `
      SELECT 
        COUNT(*) as total_plans,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count,
        COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted_count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
        COUNT(DISTINCT subject) as subjects_count
      FROM lesson_plans 
      WHERE student_id = ?
    `;

    const [stats] = await pool.execute(query, [studentId]);

    res.json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error('Get lesson plan stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson plan statistics'
    });
  }
};

module.exports = {
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
};
