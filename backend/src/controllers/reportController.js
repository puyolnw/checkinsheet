const { pool } = require('../config/database');

// Get system overview report
const getSystemOverview = async (req, res) => {
  try {
    const userRole = req.user.role_name;
    
    // Only admin can access system overview
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ไม่ได้รับอนุญาตให้เข้าถึงรายงานระบบ'
      });
    }

    // Get system statistics
    const [studentsCount] = await pool.execute('SELECT COUNT(*) as count FROM students');
    const [schoolsCount] = await pool.execute('SELECT COUNT(*) as count FROM schools');
    const [mentorsCount] = await pool.execute('SELECT COUNT(*) as count FROM mentor_teachers');
    const [supervisorsCount] = await pool.execute('SELECT COUNT(*) as count FROM supervisors');
    const [practicumCount] = await pool.execute('SELECT COUNT(*) as count FROM practicum_records');
    const [evaluationsCount] = await pool.execute('SELECT COUNT(*) as count FROM evaluations');

    // Get school distribution
    const [schoolDistribution] = await pool.execute(`
      SELECT 
        s.school_name,
        COUNT(st.id) as student_count,
        COUNT(CASE WHEN pr.id IS NOT NULL THEN 1 END) as active_students
      FROM schools s
      LEFT JOIN students st ON s.id = st.assigned_school_id
      LEFT JOIN practicum_records pr ON st.id = pr.student_id
      GROUP BY s.id, s.school_name
      ORDER BY student_count DESC
    `);

    // Get recent activities
    const [recentEvaluations] = await pool.execute(`
      SELECT 
        e.*,
        CONCAT(u.first_name, ' ', u.last_name) as student_name,
        CONCAT(eu.first_name, ' ', eu.last_name) as evaluator_name,
        ur.role_name as evaluator_role
      FROM evaluations e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN users eu ON e.evaluator_id = eu.id
      LEFT JOIN user_roles ur ON eu.role_id = ur.id
      ORDER BY e.evaluation_date DESC
      LIMIT 5
    `);

    const systemStats = {
      total_students: studentsCount[0].count,
      total_schools: schoolsCount[0].count,
      total_mentors: mentorsCount[0].count,
      total_supervisors: supervisorsCount[0].count,
      total_practicum_records: practicumCount[0].count,
      total_evaluations: evaluationsCount[0].count
    };

    res.json({
      success: true,
      data: {
        system_stats: systemStats,
        school_distribution: schoolDistribution,
        recent_activities: recentEvaluations
      }
    });

  } catch (error) {
    console.error('Get system overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate system overview report'
    });
  }
};

// Get practicum progress report
const getPracticumProgressReport = async (req, res) => {
  try {
    const userRole = req.user.role_name;
    const { page = 1, limit = 10, assigned_school_id, status } = req.query;
    const offset = (page - 1) * limit;

    // Only admin can access this report
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ไม่ได้รับอนุญาตให้เข้าถึงรายงานความก้าวหน้า'
      });
    }

    let whereClause = '';
    const params = [];

    if (assigned_school_id) {
      whereClause += ' AND s.assigned_school_id = ?';
      params.push(assigned_school_id);
    }

    if (status === 'completed') {
      whereClause += ' AND COALESCE(pr.total_hours, 0) >= 50';
    } else if (status === 'in_progress') {
      whereClause += ' AND COALESCE(pr.total_hours, 0) < 50 AND COALESCE(pr.total_hours, 0) > 0';
    } else if (status === 'not_started') {
      whereClause += ' AND COALESCE(pr.total_hours, 0) = 0';
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM students s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN (
        SELECT student_id, SUM(hours_worked) as total_hours
        FROM practicum_records
        GROUP BY student_id
      ) pr ON s.id = pr.student_id
      WHERE 1=1 ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get records
    const recordsQuery = `
      SELECT 
        s.*,
        CONCAT(u.first_name, ' ', u.last_name) as student_name,
        sch.school_name,
        CONCAT(mu.first_name, ' ', mu.last_name) as mentor_name,
        CONCAT(su.first_name, ' ', su.last_name) as supervisor_name,
        COALESCE(pr.total_hours, 0) as total_hours,
        CASE 
          WHEN COALESCE(pr.total_hours, 0) >= 50 THEN 'completed'
          WHEN COALESCE(pr.total_hours, 0) > 0 THEN 'in_progress'
          ELSE 'not_started'
        END as status
      FROM students s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN schools sch ON s.assigned_school_id = sch.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN users mu ON mt.user_id = mu.id
      LEFT JOIN supervisors sp ON s.assigned_supervisor_id = sp.id
      LEFT JOIN users su ON sp.user_id = su.id
      LEFT JOIN (
        SELECT student_id, SUM(hours_worked) as total_hours
        FROM practicum_records
        GROUP BY student_id
      ) pr ON s.id = pr.student_id
      WHERE 1=1 ${whereClause}
      ORDER BY total_hours DESC
      LIMIT ? OFFSET ?
    `;

    const [records] = await pool.execute(recordsQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get practicum progress report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate practicum progress report'
    });
  }
};

// Get evaluation summary report
const getEvaluationSummaryReport = async (req, res) => {
  try {
    const userRole = req.user.role_name;
    const { page = 1, limit = 10, evaluator_type, evaluation_type } = req.query;
    const offset = (page - 1) * limit;

    // Only admin can access this report
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ไม่ได้รับอนุญาตให้เข้าถึงรายงานการประเมิน'
      });
    }

    let whereClause = '';
    const params = [];

    if (evaluator_type) {
      whereClause += ' AND e.evaluator_type = ?';
      params.push(evaluator_type);
    }

    if (evaluation_type) {
      whereClause += ' AND e.evaluation_type = ?';
      params.push(evaluation_type);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM evaluations e
      WHERE 1=1 ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get records
    const recordsQuery = `
      SELECT 
        e.*,
        CONCAT(u.first_name, ' ', u.last_name) as student_name,
        s.student_id as student_code,
        CONCAT(eu.first_name, ' ', eu.last_name) as evaluator_name,
        ur.role_name as evaluator_role
      FROM evaluations e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN users eu ON e.evaluator_id = eu.id
      LEFT JOIN user_roles ur ON eu.role_id = ur.id
      WHERE 1=1 ${whereClause}
      ORDER BY e.evaluation_date DESC
      LIMIT ? OFFSET ?
    `;

    const [records] = await pool.execute(recordsQuery, [...params, parseInt(limit), offset]);

    // Get summary statistics
    const [summaryStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_evaluations,
        AVG(total_score) as average_score,
        MIN(total_score) as min_score,
        MAX(total_score) as max_score,
        COUNT(CASE WHEN total_score >= 80 THEN 1 END) as excellent_count,
        COUNT(CASE WHEN total_score >= 60 AND total_score < 80 THEN 1 END) as good_count,
        COUNT(CASE WHEN total_score < 60 THEN 1 END) as needs_improvement_count
      FROM evaluations e
      WHERE 1=1 ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        records,
        summary_stats: summaryStats[0],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get evaluation summary report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate evaluation summary report'
    });
  }
};

// Get student performance report
const getStudentPerformanceReport = async (req, res) => {
  try {
    const userRole = req.user.role_name;
    const { page = 1, limit = 10, assigned_school_id, grade } = req.query;
    const offset = (page - 1) * limit;

    // Only admin can access this report
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ไม่ได้รับอนุญาตให้เข้าถึงรายงานผลการเรียน'
      });
    }

    let whereClause = '';
    const params = [];

    if (assigned_school_id) {
      whereClause += ' AND s.assigned_school_id = ?';
      params.push(assigned_school_id);
    }

    if (grade) {
      whereClause += ' AND e.grade = ?';
      params.push(grade);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT s.id) as total
      FROM students s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN evaluations e ON s.id = e.student_id
      WHERE 1=1 ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get records
    const recordsQuery = `
      SELECT 
        s.*,
        CONCAT(u.first_name, ' ', u.last_name) as student_name,
        sch.school_name,
        CONCAT(mu.first_name, ' ', mu.last_name) as mentor_name,
        CONCAT(su.first_name, ' ', su.last_name) as supervisor_name,
        COUNT(e.id) as total_evaluations,
        AVG(e.total_score) as average_score,
        MAX(e.total_score) as best_score,
        MIN(e.total_score) as worst_score,
        COALESCE(pr.total_hours, 0) as total_practicum_hours
      FROM students s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN schools sch ON s.assigned_school_id = sch.id
      LEFT JOIN mentor_teachers mt ON s.assigned_mentor_id = mt.id
      LEFT JOIN users mu ON mt.user_id = mu.id
      LEFT JOIN supervisors sp ON s.assigned_supervisor_id = sp.id
      LEFT JOIN users su ON sp.user_id = su.id
      LEFT JOIN evaluations e ON s.id = e.student_id
      LEFT JOIN (
        SELECT student_id, SUM(hours_worked) as total_hours
        FROM practicum_records
        GROUP BY student_id
      ) pr ON s.id = pr.student_id
      WHERE 1=1 ${whereClause}
      GROUP BY s.id
      ORDER BY average_score DESC
      LIMIT ? OFFSET ?
    `;

    const [records] = await pool.execute(recordsQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get student performance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate student performance report'
    });
  }
};

// Export report
const exportReport = async (req, res) => {
  try {
    const userRole = req.user.role_name;
    const { report_type, format = 'csv' } = req.body;

    // Only admin can export reports
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ไม่ได้รับอนุญาตให้ส่งออกรายงาน'
      });
    }

    // For now, return a simple CSV response
    // In a real application, you would generate actual files
    const csvContent = 'Report Type,Generated At\n' + 
                      `${report_type},${new Date().toISOString()}\n`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${report_type}_report.csv"`);
    res.send(csvContent);

  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export report'
    });
  }
};

module.exports = {
  getSystemOverview,
  getPracticumProgressReport,
  getEvaluationSummaryReport,
  getStudentPerformanceReport,
  exportReport
};