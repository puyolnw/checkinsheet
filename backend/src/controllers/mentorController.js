const { pool } = require('../config/database');

// Get all mentors with pagination and filters
const getAllMentors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, school_id, subject_specialty } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR mt.teacher_id LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (school_id) {
      whereClause += ` AND mt.school_id = ?`;
      params.push(school_id);
    }

    if (subject_specialty) {
      whereClause += ` AND mt.subject_specialty LIKE ?`;
      params.push(`%${subject_specialty}%`);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM mentor_teachers mt
      JOIN users u ON mt.user_id = u.id
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get mentors with pagination
    const mentorsQuery = `
      SELECT 
        mt.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.is_active,
        sch.school_name,
        COUNT(st.id) as student_count
      FROM mentor_teachers mt
      JOIN users u ON mt.user_id = u.id
      LEFT JOIN schools sch ON mt.school_id = sch.id
      LEFT JOIN students st ON mt.id = st.assigned_mentor_id
      ${whereClause}
      GROUP BY mt.id
      ORDER BY mt.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [mentors] = await pool.execute(mentorsQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: mentors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all mentors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors'
    });
  }
};

// Get mentor by ID
const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        mt.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.is_active,
        sch.school_name,
        COUNT(st.id) as student_count
      FROM mentor_teachers mt
      JOIN users u ON mt.user_id = u.id
      LEFT JOIN schools sch ON mt.school_id = sch.id
      LEFT JOIN students st ON mt.id = st.assigned_mentor_id
      WHERE mt.id = ?
      GROUP BY mt.id
    `;

    const [mentors] = await pool.execute(query, [id]);

    if (mentors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    res.json({
      success: true,
      data: mentors[0]
    });

  } catch (error) {
    console.error('Get mentor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor'
    });
  }
};

// Create new mentor
const createMentor = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      teacher_id,
      school_id,
      subject_specialty,
      teaching_experience,
      education_level,
      position
    } = req.body;

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create user first
      const bcrypt = require('bcryptjs');
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const userQuery = `
        INSERT INTO users (username, email, password_hash, role_id, first_name, last_name, phone, is_active)
        VALUES (?, ?, ?, 3, ?, ?, ?, 1)
      `;

      const [userResult] = await connection.execute(userQuery, [
        username, email, passwordHash, first_name, last_name, phone
      ]);

      const userId = userResult.insertId;

      // Create mentor record
      const mentorQuery = `
        INSERT INTO mentor_teachers (user_id, teacher_id, school_id, subject_specialty, teaching_experience, education_level, position, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `;

      await connection.execute(mentorQuery, [
        userId, teacher_id, school_id, subject_specialty, teaching_experience, education_level, position
      ]);

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Mentor created successfully'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Create mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mentor'
    });
  }
};

// Update mentor
const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone,
      teacher_id,
      school_id,
      subject_specialty,
      teaching_experience,
      education_level,
      position,
      is_active
    } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update user info
      const userQuery = `
        UPDATE users u
        JOIN mentor_teachers mt ON u.id = mt.user_id
        SET u.first_name = ?, u.last_name = ?, u.email = ?, u.phone = ?, u.is_active = ?, u.updated_at = NOW()
        WHERE mt.id = ?
      `;

      await connection.execute(userQuery, [first_name, last_name, email, phone, is_active, id]);

      // Update mentor info
      const mentorQuery = `
        UPDATE mentor_teachers 
        SET teacher_id = ?, school_id = ?, subject_specialty = ?, teaching_experience = ?, 
            education_level = ?, position = ?, is_active = ?, updated_at = NOW()
        WHERE id = ?
      `;

      await connection.execute(mentorQuery, [
        teacher_id, school_id, subject_specialty, teaching_experience, 
        education_level, position, is_active, id
      ]);

      await connection.commit();

      res.json({
        success: true,
        message: 'Mentor updated successfully'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mentor'
    });
  }
};

// Delete mentor
const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if mentor has students assigned
    const checkQuery = 'SELECT COUNT(*) as student_count FROM students WHERE assigned_mentor_id = ?';
    const [checkResult] = await pool.execute(checkQuery, [id]);
    const studentCount = checkResult[0].student_count;

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete mentor with assigned students'
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get user_id first
      const [mentors] = await connection.execute('SELECT user_id FROM mentor_teachers WHERE id = ?', [id]);
      
      if (mentors.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Mentor not found'
        });
      }

      const userId = mentors[0].user_id;

      // Delete mentor record
      await connection.execute('DELETE FROM mentor_teachers WHERE id = ?', [id]);

      // Delete user record
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

      await connection.commit();

      res.json({
        success: true,
        message: 'Mentor deleted successfully'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Delete mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mentor'
    });
  }
};

// Get mentor's students
const getMentorStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM students WHERE assigned_mentor_id = ?';
    const [countResult] = await pool.execute(countQuery, [id]);
    const total = countResult[0].total;

    // Get students
    const studentsQuery = `
      SELECT 
        s.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        sch.school_name,
        sp.first_name as supervisor_first_name,
        sp.last_name as supervisor_last_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN schools sch ON s.assigned_school_id = sch.id
      LEFT JOIN supervisors sp ON s.assigned_supervisor_id = sp.id
      WHERE s.assigned_mentor_id = ?
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [students] = await pool.execute(studentsQuery, [id, parseInt(limit), offset]);

    res.json({
      success: true,
      data: students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get mentor students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor students'
    });
  }
};

// Get mentor's evaluations
const getMentorEvaluations = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM evaluations WHERE evaluator_id = ? AND evaluator_type = "mentor"';
    const [countResult] = await pool.execute(countQuery, [id]);
    const total = countResult[0].total;

    // Get evaluations
    const evaluationsQuery = `
      SELECT 
        e.*,
        s.student_id,
        u.first_name as student_first_name,
        u.last_name as student_last_name
      FROM evaluations e
      JOIN students s ON e.student_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE e.evaluator_id = ? AND e.evaluator_type = 'mentor'
      ORDER BY e.evaluation_date DESC
      LIMIT ? OFFSET ?
    `;

    const [evaluations] = await pool.execute(evaluationsQuery, [id, parseInt(limit), offset]);

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
    console.error('Get mentor evaluations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor evaluations'
    });
  }
};

// Get subject specialties for filter
const getSubjectSpecialties = async (req, res) => {
  try {
    const query = 'SELECT DISTINCT subject_specialty FROM mentor_teachers WHERE subject_specialty IS NOT NULL ORDER BY subject_specialty';
    const [specialties] = await pool.execute(query);

    res.json({
      success: true,
      data: specialties.map(s => s.subject_specialty)
    });

  } catch (error) {
    console.error('Get subject specialties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subject specialties'
    });
  }
};

module.exports = {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
  getMentorStudents,
  getMentorEvaluations,
  getSubjectSpecialties
};
