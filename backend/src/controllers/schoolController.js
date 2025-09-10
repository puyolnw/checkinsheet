const { pool } = require('../config/database');

// Get all schools with pagination and filters
const getAllSchools = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, school_type, province } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ` AND (school_name LIKE ? OR director_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (school_type) {
      whereClause += ` AND school_type = ?`;
      params.push(school_type);
    }

    if (province) {
      whereClause += ` AND province = ?`;
      params.push(province);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM schools ${whereClause}`;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get schools with pagination
    const schoolsQuery = `
      SELECT 
        s.*,
        COUNT(st.id) as student_count,
        COUNT(mt.id) as mentor_count
      FROM schools s
      LEFT JOIN students st ON s.id = st.assigned_school_id
      LEFT JOIN mentor_teachers mt ON s.id = mt.school_id
      ${whereClause}
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [schools] = await pool.execute(schoolsQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: schools,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all schools error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schools'
    });
  }
};

// Get school by ID
const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        s.*,
        COUNT(DISTINCT st.id) as student_count,
        COUNT(DISTINCT mt.id) as mentor_count
      FROM schools s
      LEFT JOIN students st ON s.id = st.assigned_school_id
      LEFT JOIN mentor_teachers mt ON s.id = mt.school_id
      WHERE s.id = ?
      GROUP BY s.id
    `;

    const [schools] = await pool.execute(query, [id]);

    if (schools.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.json({
      success: true,
      data: schools[0]
    });

  } catch (error) {
    console.error('Get school by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school'
    });
  }
};

// Create new school
const createSchool = async (req, res) => {
  try {
    const {
      school_name,
      school_type,
      address,
      district,
      province,
      postal_code,
      phone,
      email,
      director_name
    } = req.body;

    const query = `
      INSERT INTO schools (school_name, school_type, address, district, province, postal_code, phone, email, director_name, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    const [result] = await pool.execute(query, [
      school_name, school_type, address, district, province, postal_code, phone, email, director_name
    ]);

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Create school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create school'
    });
  }
};

// Update school
const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      school_name,
      school_type,
      address,
      district,
      province,
      postal_code,
      phone,
      email,
      director_name,
      is_active
    } = req.body;

    const query = `
      UPDATE schools 
      SET school_name = ?, school_type = ?, address = ?, district = ?, province = ?, 
          postal_code = ?, phone = ?, email = ?, director_name = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await pool.execute(query, [
      school_name, school_type, address, district, province, 
      postal_code, phone, email, director_name, is_active, id
    ]);

    res.json({
      success: true,
      message: 'School updated successfully'
    });

  } catch (error) {
    console.error('Update school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update school'
    });
  }
};

// Delete school
const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if school has students or mentors assigned
    const checkQuery = `
      SELECT 
        (SELECT COUNT(*) FROM students WHERE assigned_school_id = ?) as student_count,
        (SELECT COUNT(*) FROM mentor_teachers WHERE school_id = ?) as mentor_count
    `;

    const [checkResult] = await pool.execute(checkQuery, [id, id]);
    const { student_count, mentor_count } = checkResult[0];

    if (student_count > 0 || mentor_count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete school with assigned students or mentors'
      });
    }

    await pool.execute('DELETE FROM schools WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'School deleted successfully'
    });

  } catch (error) {
    console.error('Delete school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete school'
    });
  }
};

// Get school's students
const getSchoolStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM students WHERE assigned_school_id = ?';
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
        mt.first_name as mentor_first_name,
        mt.last_name as mentor_last_name,
        sp.first_name as supervisor_first_name,
        sp.last_name as supervisor_last_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN supervisors sp ON s.assigned_supervisor_id = sp.id
      WHERE s.assigned_school_id = ?
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
    console.error('Get school students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school students'
    });
  }
};

// Get school's mentors
const getSchoolMentors = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        mt.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        COUNT(st.id) as student_count
      FROM mentor_teachers mt
      JOIN users u ON mt.user_id = u.id
      LEFT JOIN students st ON mt.id = st.assigned_mentor_id
      WHERE mt.school_id = ?
      GROUP BY mt.id
      ORDER BY mt.created_at DESC
    `;

    const [mentors] = await pool.execute(query, [id]);

    res.json({
      success: true,
      data: mentors
    });

  } catch (error) {
    console.error('Get school mentors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school mentors'
    });
  }
};

// Get provinces for filter
const getProvinces = async (req, res) => {
  try {
    const query = 'SELECT DISTINCT province FROM schools WHERE province IS NOT NULL ORDER BY province';
    const [provinces] = await pool.execute(query);

    res.json({
      success: true,
      data: provinces.map(p => p.province)
    });

  } catch (error) {
    console.error('Get provinces error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provinces'
    });
  }
};

// Get school types for filter
const getSchoolTypes = async (req, res) => {
  try {
    const query = 'SELECT DISTINCT school_type FROM schools WHERE school_type IS NOT NULL ORDER BY school_type';
    const [types] = await pool.execute(query);

    res.json({
      success: true,
      data: types.map(t => t.school_type)
    });

  } catch (error) {
    console.error('Get school types error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school types'
    });
  }
};


module.exports = {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolStudents,
  getSchoolMentors,
  getProvinces,
  getSchoolTypes
};
