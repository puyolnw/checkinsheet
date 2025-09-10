const { pool } = require('../config/database');

// Get all practicum records with pagination and filters
const getAllPracticumRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, student_id, date_from, date_to } = req.query;
    const offset = (page - 1) * limit;
    const userRole = req.user.role_name;
    const userId = req.user.id;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // สำหรับ students ให้ดูเฉพาะข้อมูลของตนเอง
    if (userRole === 'student') {
      // หา student ID จาก user ID
      const [studentQuery] = await pool.execute(
        'SELECT id FROM students WHERE user_id = ?',
        [userId]
      );
      if (studentQuery.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student record not found'
        });
      }
      whereClause += ` AND pr.student_id = ?`;
      params.push(studentQuery[0].id);
    }

    if (search) {
      whereClause += ` AND (pr.activities_description LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ` AND pr.status = ?`;
      params.push(status);
    }

    if (student_id && userRole !== 'student') {
      whereClause += ` AND pr.student_id = ?`;
      params.push(student_id);
    }

    if (date_from) {
      whereClause += ` AND pr.record_date >= ?`;
      params.push(date_from);
    }

    if (date_to) {
      whereClause += ` AND pr.record_date <= ?`;
      params.push(date_to);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM practicum_records pr
      JOIN students s ON pr.student_id = s.id
      JOIN users u ON s.user_id = u.id
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get records with pagination
    const recordsQuery = `
      SELECT 
        pr.*,
        s.student_id,
        u.first_name as student_first_name,
        u.last_name as student_last_name,
        sch.school_name
      FROM practicum_records pr
      JOIN students s ON pr.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN schools sch ON s.assigned_school_id = sch.id
      ${whereClause}
      ORDER BY pr.record_date DESC, pr.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [records] = await pool.execute(recordsQuery, [...params, parseInt(limit), offset]);

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
    console.error('Get all practicum records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practicum records'
    });
  }
};

// Get practicum record by ID
const getPracticumRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    const query = `
      SELECT 
        pr.*,
        s.student_id,
        u.first_name as student_first_name,
        u.last_name as student_last_name,
        sch.school_name,
        mt.first_name as mentor_first_name,
        mt.last_name as mentor_last_name,
        sp.first_name as supervisor_first_name,
        sp.last_name as supervisor_last_name
      FROM practicum_records pr
      JOIN students s ON pr.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN schools sch ON s.assigned_school_id = sch.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN supervisors sp ON s.assigned_supervisor_id = sp.id
      WHERE pr.id = ?
    `;

    const [records] = await pool.execute(query, [id]);

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Practicum record not found'
      });
    }

    // สำหรับ students ให้ดูเฉพาะข้อมูลของตนเอง
    if (userRole === 'student' && records[0].student_id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'ไม่สามารถเข้าถึงข้อมูลของผู้อื่นได้'
      });
    }

    res.json({
      success: true,
      data: records[0]
    });

  } catch (error) {
    console.error('Get practicum record by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practicum record'
    });
  }
};

// Create new practicum record
const createPracticumRecord = async (req, res) => {
  try {
    const {
      student_id,
      record_date,
      start_time,
      end_time,
      hours_worked,
      activities_description,
      learning_outcomes,
      challenges_faced,
      reflections,
      status = 'draft'
    } = req.body;
    
    const userRole = req.user.role;
    const userId = req.user.id;

    // สำหรับ students ให้สร้างเฉพาะข้อมูลของตนเอง
    if (userRole === 'student' && userId.toString() !== student_id) {
      return res.status(403).json({
        success: false,
        message: 'ไม่สามารถสร้างข้อมูลของผู้อื่นได้'
      });
    }

    const query = `
      INSERT INTO practicum_records (
        student_id, record_date, start_time, end_time, hours_worked,
        activities_description, learning_outcomes, challenges_faced, reflections, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      student_id, record_date, start_time, end_time, hours_worked,
      activities_description, learning_outcomes, challenges_faced, reflections, status
    ]);

    // Update student's completed hours if status is approved
    if (status === 'approved') {
      await pool.execute(
        'UPDATE students SET practicum_hours_completed = practicum_hours_completed + ? WHERE id = ?',
        [hours_worked, student_id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Practicum record created successfully',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Create practicum record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create practicum record'
    });
  }
};

// Update practicum record
const updatePracticumRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      record_date,
      start_time,
      end_time,
      hours_worked,
      activities_description,
      learning_outcomes,
      challenges_faced,
      reflections,
      status
    } = req.body;
    
    const userRole = req.user.role;
    const userId = req.user.id;

    // Get current record to check status change
    const [currentRecord] = await pool.execute(
      'SELECT status, hours_worked, student_id FROM practicum_records WHERE id = ?',
      [id]
    );

    if (currentRecord.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Practicum record not found'
      });
    }

    // สำหรับ students ให้แก้ไขเฉพาะข้อมูลของตนเอง
    if (userRole === 'student' && currentRecord[0].student_id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'ไม่สามารถแก้ไขข้อมูลของผู้อื่นได้'
      });
    }

    const oldStatus = currentRecord[0].status;
    const oldHours = currentRecord[0].hours_worked;
    const studentId = currentRecord[0].student_id;

    const query = `
      UPDATE practicum_records 
      SET record_date = ?, start_time = ?, end_time = ?, hours_worked = ?,
          activities_description = ?, learning_outcomes = ?, challenges_faced = ?,
          reflections = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await pool.execute(query, [
      record_date, start_time, end_time, hours_worked,
      activities_description, learning_outcomes, challenges_faced,
      reflections, status, id
    ]);

    // Update student's completed hours if status changed
    if (oldStatus !== status) {
      if (oldStatus === 'approved' && status !== 'approved') {
        // Remove old hours
        await pool.execute(
          'UPDATE students SET practicum_hours_completed = practicum_hours_completed - ? WHERE id = ?',
          [oldHours, studentId]
        );
      } else if (oldStatus !== 'approved' && status === 'approved') {
        // Add new hours
        await pool.execute(
          'UPDATE students SET practicum_hours_completed = practicum_hours_completed + ? WHERE id = ?',
          [hours_worked, studentId]
        );
      } else if (oldStatus === 'approved' && status === 'approved' && oldHours !== hours_worked) {
        // Update hours difference
        const hoursDiff = hours_worked - oldHours;
        await pool.execute(
          'UPDATE students SET practicum_hours_completed = practicum_hours_completed + ? WHERE id = ?',
          [hoursDiff, studentId]
        );
      }
    }

    res.json({
      success: true,
      message: 'Practicum record updated successfully'
    });

  } catch (error) {
    console.error('Update practicum record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update practicum record'
    });
  }
};

// Approve practicum record (mentor or supervisor)
const approvePracticumRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role_name;

    let updateQuery;
    let updateParams;

    if (userRole === 'mentor') {
      updateQuery = `
        UPDATE practicum_records 
        SET status = 'approved', mentor_feedback = ?, mentor_approved_at = NOW(), updated_at = NOW()
        WHERE id = ?
      `;
      updateParams = [feedback, id];
    } else if (userRole === 'supervisor') {
      updateQuery = `
        UPDATE practicum_records 
        SET status = 'approved', supervisor_feedback = ?, supervisor_approved_at = NOW(), updated_at = NOW()
        WHERE id = ?
      `;
      updateParams = [feedback, id];
    } else {
      return res.status(403).json({
        success: false,
        message: 'Only mentors and supervisors can approve practicum records'
      });
    }

    const [result] = await pool.execute(updateQuery, updateParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Practicum record not found'
      });
    }

    // Update student's completed hours
    const [record] = await pool.execute(
      'SELECT hours_worked, student_id FROM practicum_records WHERE id = ?',
      [id]
    );

    if (record.length > 0) {
      await pool.execute(
        'UPDATE students SET practicum_hours_completed = practicum_hours_completed + ? WHERE id = ?',
        [record[0].hours_worked, record[0].student_id]
      );
    }

    res.json({
      success: true,
      message: 'Practicum record approved successfully'
    });

  } catch (error) {
    console.error('Approve practicum record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve practicum record'
    });
  }
};

// Reject practicum record (mentor or supervisor)
const rejectPracticumRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role_name;

    if (!feedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback is required when rejecting a record'
      });
    }

    let updateQuery;
    let updateParams;

    if (userRole === 'mentor') {
      updateQuery = `
        UPDATE practicum_records 
        SET status = 'rejected', mentor_feedback = ?, updated_at = NOW()
        WHERE id = ?
      `;
      updateParams = [feedback, id];
    } else if (userRole === 'supervisor') {
      updateQuery = `
        UPDATE practicum_records 
        SET status = 'rejected', supervisor_feedback = ?, updated_at = NOW()
        WHERE id = ?
      `;
      updateParams = [feedback, id];
    } else {
      return res.status(403).json({
        success: false,
        message: 'Only mentors and supervisors can reject practicum records'
      });
    }

    const [result] = await pool.execute(updateQuery, updateParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Practicum record not found'
      });
    }

    res.json({
      success: true,
      message: 'Practicum record rejected successfully'
    });

  } catch (error) {
    console.error('Reject practicum record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject practicum record'
    });
  }
};

// Delete practicum record
const deletePracticumRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    // Get record info before deletion
    const [record] = await pool.execute(
      'SELECT status, hours_worked, student_id FROM practicum_records WHERE id = ?',
      [id]
    );

    if (record.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Practicum record not found'
      });
    }

    // สำหรับ students ให้ลบเฉพาะข้อมูลของตนเอง
    if (userRole === 'student' && record[0].student_id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'ไม่สามารถลบข้อมูลของผู้อื่นได้'
      });
    }

    // Delete the record
    await pool.execute('DELETE FROM practicum_records WHERE id = ?', [id]);

    // Update student's completed hours if record was approved
    if (record[0].status === 'approved') {
      await pool.execute(
        'UPDATE students SET practicum_hours_completed = practicum_hours_completed - ? WHERE id = ?',
        [record[0].hours_worked, record[0].student_id]
      );
    }

    res.json({
      success: true,
      message: 'Practicum record deleted successfully'
    });

  } catch (error) {
    console.error('Delete practicum record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete practicum record'
    });
  }
};

// Get student's practicum summary
const getStudentPracticumSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userRole = req.user.role_name;
    const userId = req.user.id;

    // สำหรับ students ให้ดูเฉพาะข้อมูลของตนเอง
    if (userRole === 'student' && userId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'ไม่สามารถเข้าถึงข้อมูลของผู้อื่นได้'
      });
    }

    // ถ้า studentId เป็น user ID ให้หา student ID ก่อน
    let actualStudentId = studentId;
    if (userRole === 'student') {
      // สำหรับ student ให้ใช้ user ID ของตนเอง
      const [studentQuery] = await pool.execute(
        'SELECT id FROM students WHERE user_id = ?',
        [userId]
      );
      if (studentQuery.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student record not found'
        });
      }
      actualStudentId = studentQuery[0].id;
    }

    const query = `
      SELECT 
        s.practicum_hours_required,
        COUNT(pr.id) as total_records,
        COUNT(CASE WHEN pr.status = 'approved' THEN 1 END) as approved_records,
        COUNT(CASE WHEN pr.status = 'pending' THEN 1 END) as pending_records,
        COUNT(CASE WHEN pr.status = 'rejected' THEN 1 END) as rejected_records,
        COALESCE(SUM(CASE WHEN pr.status = 'approved' THEN pr.hours_worked ELSE 0 END), 0) as practicum_hours_completed,
        COALESCE(SUM(CASE WHEN pr.status = 'approved' THEN pr.hours_worked ELSE 0 END), 0) as total_approved_hours
      FROM students s
      LEFT JOIN practicum_records pr ON s.id = pr.student_id
      WHERE s.id = ?
      GROUP BY s.id, s.practicum_hours_required
    `;

    const [summary] = await pool.execute(query, [actualStudentId]);

    console.log('Practicum summary query result:', {
      studentId: actualStudentId,
      summary: summary[0]
    });

    if (summary.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: summary[0]
    });

  } catch (error) {
    console.error('Get student practicum summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practicum summary'
    });
  }
};

module.exports = {
  getAllPracticumRecords,
  getPracticumRecordById,
  createPracticumRecord,
  updatePracticumRecord,
  approvePracticumRecord,
  rejectPracticumRecord,
  deletePracticumRecord,
  getStudentPracticumSummary
};
