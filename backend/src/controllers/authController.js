const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Generate JWT token
const generateToken = (userId, roleId) => {
  const secret = process.env.JWT_SECRET || 'student-practicum-system-secret-key-2024';
  return jwt.sign(
    { userId, roleId },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user by username or email
    const [users] = await pool.execute(
      `SELECT u.*, ur.role_name 
       FROM users u 
       JOIN user_roles ur ON u.role_id = ur.id 
       WHERE (u.username = ? OR u.email = ?) AND u.is_active = 1`,
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role_id);

    // Update last login
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Log login history
    await pool.execute(
      `INSERT INTO login_history (user_id, ip_address, user_agent, login_status) 
       VALUES (?, ?, ?, 'success')`,
      [user.id, req.ip, req.get('User-Agent')]
    );

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user details with role
    const [users] = await pool.execute(
      `SELECT u.*, ur.role_name 
       FROM users u 
       LEFT JOIN user_roles ur ON u.role_id = ur.id 
       WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    const { password_hash, ...userWithoutPassword } = user;

    // Get additional profile data based on role
    let profileData = { ...userWithoutPassword };

    if (user.role_name === 'student') {
      const [students] = await pool.execute(
        `SELECT s.*, sch.school_name, 
                mtu.first_name as mentor_first_name, mtu.last_name as mentor_last_name,
                spu.first_name as supervisor_first_name, spu.last_name as supervisor_last_name
         FROM students s
         LEFT JOIN schools sch ON s.assigned_school_id = sch.id
         LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
         LEFT JOIN users mtu ON mt.user_id = mtu.id
         LEFT JOIN supervisors sp ON s.assigned_supervisor_id = sp.id
         LEFT JOIN users spu ON sp.user_id = spu.id
         WHERE s.user_id = ?`,
        [userId]
      );
      if (students.length > 0) {
        profileData.student_info = students[0];
      }
    } else if (user.role_name === 'mentor') {
      const [mentors] = await pool.execute(
        `SELECT mt.*, sch.school_name
         FROM mentor_teachers mt
         LEFT JOIN schools sch ON mt.school_id = sch.id
         WHERE mt.user_id = ?`,
        [userId]
      );
      if (mentors.length > 0) {
        profileData.mentor_info = mentors[0];
      }
    } else if (user.role_name === 'supervisor') {
      const [supervisors] = await pool.execute(
        'SELECT * FROM supervisors WHERE user_id = ?',
        [userId]
      );
      if (supervisors.length > 0) {
        profileData.supervisor_info = supervisors[0];
      }
    }

    res.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    console.error('Error details:', {
      message: error.message,
      sql: error.sql,
      code: error.code,
      errno: error.errno
    });
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Logout (client-side token removal, but we can log it)
const logout = async (req, res) => {
  try {
    // Log logout in login history
    await pool.execute(
      `UPDATE login_history 
       SET logout_time = NOW(), session_duration = TIMESTAMPDIFF(SECOND, login_time, NOW())
       WHERE user_id = ? AND logout_time IS NULL
       ORDER BY login_time DESC LIMIT 1`,
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get current password hash
    const [users] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.execute(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
      [newPasswordHash, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// Register student
const registerStudent = async (req, res) => {
  try {
    const {
      // User data
      username,
      email,
      password,
      first_name,
      last_name,
      phone,
      
      // Student data
      student_id,
      major,
      year_level,
      semester,
      academic_year,
      gpa
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !first_name || !last_name || !student_id) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
      });
    }

    // Check if username or email already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่แล้ว'
      });
    }

    // Check if student_id already exists
    const [existingStudents] = await pool.execute(
      'SELECT id FROM students WHERE student_id = ?',
      [student_id]
    );

    if (existingStudents.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'รหัสนักศึกษานี้มีอยู่แล้ว'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Get connection for transaction
    const connection = await pool.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();

      // Insert user
      const [userResult] = await connection.execute(
        `INSERT INTO users (username, email, password_hash, role_id, first_name, last_name, phone, is_active) 
         VALUES (?, ?, ?, 2, ?, ?, ?, 1)`,
        [username, email, passwordHash, first_name, last_name, phone]
      );

      const userId = userResult.insertId;

      // Insert student
      await connection.execute(
        `INSERT INTO students (user_id, student_id, major, year_level, semester, academic_year, gpa, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'registered')`,
        [userId, student_id, major || 'บรรณารักษ์ศึกษา-ภาษาอังกฤษ', year_level || 4, semester || 2, academic_year || '2567', gpa]
      );

      // Commit transaction
      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'สมัครสมาชิกสำเร็จ',
        data: {
          user_id: userId,
          username,
          email,
          student_id
        }
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
    console.error('Student registration error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
    });
  }
};

module.exports = {
  login,
  getProfile,
  logout,
  changePassword,
  registerStudent
};
