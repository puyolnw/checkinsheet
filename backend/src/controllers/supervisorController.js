const { pool } = require('../config/database');

// Get all supervisors with pagination and filters
const getAllSupervisors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, subject_specialty } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR sp.employee_id LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (department) {
      whereClause += ` AND sp.department = ?`;
      params.push(department);
    }

    if (subject_specialty) {
      whereClause += ` AND sp.subject_specialty LIKE ?`;
      params.push(`%${subject_specialty}%`);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM supervisors sp
      JOIN users u ON sp.user_id = u.id
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get supervisors with pagination
    const supervisorsQuery = `
      SELECT 
        sp.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.is_active,
        COUNT(st.id) as student_count
      FROM supervisors sp
      JOIN users u ON sp.user_id = u.id
      LEFT JOIN students st ON sp.id = st.assigned_supervisor_id
      ${whereClause}
      GROUP BY sp.id
      ORDER BY sp.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [supervisors] = await pool.execute(supervisorsQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: supervisors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all supervisors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supervisors'
    });
  }
};

// Get supervisor by ID
const getSupervisorById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        sp.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.is_active,
        COUNT(st.id) as student_count
      FROM supervisors sp
      JOIN users u ON sp.user_id = u.id
      LEFT JOIN students st ON sp.id = st.assigned_supervisor_id
      WHERE sp.id = ?
      GROUP BY sp.id
    `;

    const [supervisors] = await pool.execute(query, [id]);

    if (supervisors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found'
      });
    }

    res.json({
      success: true,
      data: supervisors[0]
    });

  } catch (error) {
    console.error('Get supervisor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supervisor'
    });
  }
};

// Create new supervisor
const createSupervisor = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      employee_id,
      department,
      faculty,
      subject_specialty,
      academic_rank,
      education_level
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
        VALUES (?, ?, ?, 4, ?, ?, ?, 1)
      `;

      const [userResult] = await connection.execute(userQuery, [
        username, email, passwordHash, first_name, last_name, phone
      ]);

      const userId = userResult.insertId;

      // Create supervisor record
      const supervisorQuery = `
        INSERT INTO supervisors (user_id, employee_id, department, faculty, subject_specialty, academic_rank, education_level, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `;

      await connection.execute(supervisorQuery, [
        userId, employee_id, department, faculty, subject_specialty, academic_rank, education_level
      ]);

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Supervisor created successfully'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Create supervisor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create supervisor'
    });
  }
};

// Update supervisor
const updateSupervisor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone,
      employee_id,
      department,
      faculty,
      subject_specialty,
      academic_rank,
      education_level,
      is_active
    } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update user info
      const userQuery = `
        UPDATE users u
        JOIN supervisors sp ON u.id = sp.user_id
        SET u.first_name = ?, u.last_name = ?, u.email = ?, u.phone = ?, u.is_active = ?, u.updated_at = NOW()
        WHERE sp.id = ?
      `;

      await connection.execute(userQuery, [first_name, last_name, email, phone, is_active, id]);

      // Update supervisor info
      const supervisorQuery = `
        UPDATE supervisors 
        SET employee_id = ?, department = ?, faculty = ?, subject_specialty = ?, 
            academic_rank = ?, education_level = ?, is_active = ?, updated_at = NOW()
        WHERE id = ?
      `;

      await connection.execute(supervisorQuery, [
        employee_id, department, faculty, subject_specialty, 
        academic_rank, education_level, is_active, id
      ]);

      await connection.commit();

      res.json({
        success: true,
        message: 'Supervisor updated successfully'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Update supervisor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update supervisor'
    });
  }
};

// Delete supervisor
const deleteSupervisor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if supervisor has students assigned
    const checkQuery = 'SELECT COUNT(*) as student_count FROM students WHERE assigned_supervisor_id = ?';
    const [checkResult] = await pool.execute(checkQuery, [id]);
    const studentCount = checkResult[0].student_count;

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete supervisor with assigned students'
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get user_id first
      const [supervisors] = await connection.execute('SELECT user_id FROM supervisors WHERE id = ?', [id]);
      
      if (supervisors.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Supervisor not found'
        });
      }

      const userId = supervisors[0].user_id;

      // Delete supervisor record
      await connection.execute('DELETE FROM supervisors WHERE id = ?', [id]);

      // Delete user record
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

      await connection.commit();

      res.json({
        success: true,
        message: 'Supervisor deleted successfully'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Delete supervisor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete supervisor'
    });
  }
};

// Get supervisor's students
const getSupervisorStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM students WHERE assigned_supervisor_id = ?';
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
        mt.first_name as mentor_first_name,
        mt.last_name as mentor_last_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN schools sch ON s.assigned_school_id = sch.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      WHERE s.assigned_supervisor_id = ?
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
    console.error('Get supervisor students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supervisor students'
    });
  }
};

// Get supervisor's evaluations
const getSupervisorEvaluations = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM evaluations WHERE evaluator_id = ? AND evaluator_type = "supervisor"';
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
      WHERE e.evaluator_id = ? AND e.evaluator_type = 'supervisor'
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
    console.error('Get supervisor evaluations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supervisor evaluations'
    });
  }
};

// Get departments for filter
const getDepartments = async (req, res) => {
  try {
    const query = 'SELECT DISTINCT department FROM supervisors WHERE department IS NOT NULL ORDER BY department';
    const [departments] = await pool.execute(query);

    res.json({
      success: true,
      data: departments.map(d => d.department)
    });

  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments'
    });
  }
};

// Get academic ranks for filter
const getAcademicRanks = async (req, res) => {
  try {
    const query = 'SELECT DISTINCT academic_rank FROM supervisors WHERE academic_rank IS NOT NULL ORDER BY academic_rank';
    const [ranks] = await pool.execute(query);

    res.json({
      success: true,
      data: ranks.map(r => r.academic_rank)
    });

  } catch (error) {
    console.error('Get academic ranks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch academic ranks'
    });
  }
};

module.exports = {
  getAllSupervisors,
  getSupervisorById,
  createSupervisor,
  updateSupervisor,
  deleteSupervisor,
  getSupervisorStudents,
  getSupervisorEvaluations,
  getDepartments,
  getAcademicRanks
};
