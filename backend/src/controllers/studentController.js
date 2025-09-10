const { pool } = require('../config/database');

// Get all students with pagination and filters
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, school_id } = req.query;
    const offset = (page - 1) * limit;
    const userRole = req.user.role_name;
    const userId = req.user.id;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // สำหรับ mentors ให้ดูเฉพาะนักเรียนที่ตนเองเป็นครูพี่เลี้ยง
    if (userRole === 'mentor') {
      whereClause += ` AND s.assigned_mentor_id = ?`;
      params.push(userId);
    }
    
    // สำหรับ supervisors ให้ดูเฉพาะนักเรียนที่ตนเองเป็นอาจารย์นิเทศ
    if (userRole === 'supervisor') {
      whereClause += ` AND s.assigned_supervisor_id = ?`;
      params.push(userId);
    }

    if (search) {
      whereClause += ` AND (s.student_id LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ` AND s.status = ?`;
      params.push(status);
    }

    if (school_id && userRole === 'admin') {
      whereClause += ` AND s.assigned_school_id = ?`;
      params.push(school_id);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM students s
      JOIN users u ON s.user_id = u.id
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get students with pagination
    const studentsQuery = `
      SELECT 
        s.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.is_active,
        sch.school_name,
        mtu.first_name as mentor_first_name,
        mtu.last_name as mentor_last_name,
        spu.first_name as supervisor_first_name,
        spu.last_name as supervisor_last_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN schools sch ON s.assigned_school_id = sch.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN users mtu ON mt.user_id = mtu.id
      LEFT JOIN supervisors sp ON s.assigned_supervisor_id = sp.id
      LEFT JOIN users spu ON sp.user_id = spu.id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [students] = await pool.execute(studentsQuery, [...params, parseInt(limit), offset]);

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
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role_name;
    const userId = req.user.id;

    const query = `
      SELECT 
        s.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.is_active,
        sch.school_name,
        mtu.first_name as mentor_first_name,
        mtu.last_name as mentor_last_name,
        spu.first_name as supervisor_first_name,
        spu.last_name as supervisor_last_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN schools sch ON s.assigned_school_id = sch.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN users mtu ON mt.user_id = mtu.id
      LEFT JOIN supervisors sp ON s.assigned_supervisor_id = sp.id
      LEFT JOIN users spu ON sp.user_id = spu.id
      WHERE s.id = ?
    `;

    const [students] = await pool.execute(query, [id]);

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // สำหรับ mentors ให้ดูเฉพาะนักเรียนที่ตนเองเป็นครูพี่เลี้ยง
    if (userRole === 'mentor' && students[0].assigned_mentor_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'ไม่สามารถเข้าถึงข้อมูลของผู้อื่นได้'
      });
    }
    
    // สำหรับ supervisors ให้ดูเฉพาะนักเรียนที่ตนเองเป็นอาจารย์นิเทศ
    if (userRole === 'supervisor' && students[0].assigned_supervisor_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'ไม่สามารถเข้าถึงข้อมูลของผู้อื่นได้'
      });
    }

    res.json({
      success: true,
      data: students[0]
    });

  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student'
    });
  }
};

// Assign school to student
const assignSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { schoolId } = req.body;

    const query = `
      UPDATE students 
      SET assigned_school_id = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await pool.execute(query, [schoolId, id]);

    res.json({
      success: true,
      message: 'School assigned successfully'
    });

  } catch (error) {
    console.error('Assign school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign school'
    });
  }
};

// Assign mentor to student
const assignMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.body;

    const query = `
      UPDATE students 
      SET assigned_mentor_id = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await pool.execute(query, [mentorId, id]);

    res.json({
      success: true,
      message: 'Mentor assigned successfully'
    });

  } catch (error) {
    console.error('Assign mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign mentor'
    });
  }
};

// Assign supervisor to student
const assignSupervisor = async (req, res) => {
  try {
    const { id } = req.params;
    const { supervisorId } = req.body;

    const query = `
      UPDATE students 
      SET assigned_supervisor_id = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await pool.execute(query, [supervisorId, id]);

    res.json({
      success: true,
      message: 'Supervisor assigned successfully'
    });

  } catch (error) {
    console.error('Assign supervisor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign supervisor'
    });
  }
};

// Get student's practicum records
const getStudentPracticumRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM practicum_records WHERE student_id = ?';
    const [countResult] = await pool.execute(countQuery, [id]);
    const total = countResult[0].total;

    // Get records
    const recordsQuery = `
      SELECT * FROM practicum_records 
      WHERE student_id = ? 
      ORDER BY record_date DESC 
      LIMIT ? OFFSET ?
    `;

    const [records] = await pool.execute(recordsQuery, [id, parseInt(limit), offset]);

    res.json({
      success: true,
      data: records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get student practicum records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practicum records'
    });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      first_name,
      last_name,
      phone,
      student_id,
      major,
      year_level,
      semester,
      academic_year,
      gpa,
      status
    } = req.body;

    // Validate required fields
    if (!username || !email || !first_name || !last_name || !student_id) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    // Get student with user info
    const [students] = await pool.execute(
      `SELECT s.*, u.username, u.email, u.first_name, u.last_name, u.phone
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id]
    );

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลนักศึกษา'
      });
    }

    const student = students[0];

    // Check if username or email already exists (excluding current user)
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
      [username, email, student.user_id]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่แล้ว'
      });
    }

    // Check if student_id already exists (excluding current student)
    const [existingStudents] = await pool.execute(
      'SELECT id FROM students WHERE student_id = ? AND id != ?',
      [student_id, id]
    );

    if (existingStudents.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'รหัสนักศึกษานี้มีอยู่แล้ว'
      });
    }

    // Get connection for transaction
    const connection = await pool.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();

      // Update user
      await connection.execute(
        `UPDATE users SET username = ?, email = ?, first_name = ?, last_name = ?, phone = ?, updated_at = NOW()
         WHERE id = ?`,
        [username, email, first_name, last_name, phone, student.user_id]
      );

      // Update student
      await connection.execute(
        `UPDATE students SET student_id = ?, major = ?, year_level = ?, semester = ?, academic_year = ?, gpa = ?, status = ?, updated_at = NOW()
         WHERE id = ?`,
        [student_id, major, year_level, semester, academic_year, gpa, status, id]
      );

      // Commit transaction
      await connection.commit();

      res.json({
        success: true,
        message: 'อัปเดตข้อมูลนักศึกษาเรียบร้อยแล้ว'
      });

    } catch (error) {
      // Rollback transaction
      await connection.rollback();
      throw error;
    } finally {
      // Release connection
      connection.release();
    }

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตนักศึกษา'
    });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Get student with user info
    const [students] = await pool.execute(
      `SELECT s.*, u.id as user_id
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id]
    );

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลนักศึกษา'
      });
    }

    const student = students[0];

    // Get connection for transaction
    const connection = await pool.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();

      // Delete student
      await connection.execute('DELETE FROM students WHERE id = ?', [id]);

      // Delete user
      await connection.execute('DELETE FROM users WHERE id = ?', [student.user_id]);

      // Commit transaction
      await connection.commit();

      res.json({
        success: true,
        message: 'ลบนักศึกษาเรียบร้อยแล้ว'
      });

    } catch (error) {
      // Rollback transaction
      await connection.rollback();
      throw error;
    } finally {
      // Release connection
      connection.release();
    }

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบนักศึกษา'
    });
  }
};

// Get students by mentor
const getStudentsByMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const userRole = req.user.role_name;
    const userId = req.user.id;

    // สำหรับ mentors ให้ดูเฉพาะนักเรียนของตนเอง
    if (userRole === 'mentor' && userId.toString() !== mentorId) {
      return res.status(403).json({
        success: false,
        message: 'ไม่สามารถเข้าถึงข้อมูลของผู้อื่นได้'
      });
    }

    const query = `
      SELECT 
        s.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.is_active,
        sch.school_name,
        spu.first_name as supervisor_first_name,
        spu.last_name as supervisor_last_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN schools sch ON s.assigned_school_id = sch.id
      LEFT JOIN supervisors sp ON s.assigned_supervisor_id = sp.id
      LEFT JOIN users spu ON sp.user_id = spu.id
      WHERE s.assigned_mentor_id = ?
      ORDER BY u.first_name, u.last_name
    `;

    const [students] = await pool.execute(query, [mentorId]);

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Get students by mentor error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา'
    });
  }
};

// Get students by supervisor
const getStudentsBySupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.params;
    const userRole = req.user.role_name;
    const userId = req.user.id;

    // สำหรับ supervisors ให้ดูเฉพาะนักเรียนของตนเอง
    if (userRole === 'supervisor' && userId.toString() !== supervisorId) {
      return res.status(403).json({
        success: false,
        message: 'ไม่สามารถเข้าถึงข้อมูลของผู้อื่นได้'
      });
    }

    const query = `
      SELECT 
        s.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.is_active,
        sch.school_name,
        mtu.first_name as mentor_first_name,
        mtu.last_name as mentor_last_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN schools sch ON s.assigned_school_id = sch.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN users mtu ON mt.user_id = mtu.id
      WHERE s.assigned_supervisor_id = ?
      ORDER BY u.first_name, u.last_name
    `;

    const [students] = await pool.execute(query, [supervisorId]);

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Get students by supervisor error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา'
    });
  }
};

module.exports = {
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
};