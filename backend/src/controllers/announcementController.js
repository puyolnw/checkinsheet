const { pool } = require('../config/database');

// Get all announcements with pagination and filters
const getAllAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, is_active, author_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ` AND (a.title LIKE ? OR a.content LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      whereClause += ` AND a.announcement_type = ?`;
      params.push(category);
    }

    if (is_active !== undefined) {
      whereClause += ` AND a.is_published = ?`;
      params.push(is_active === 'true' ? 1 : 0);
    }

    if (author_id) {
      whereClause += ` AND a.created_by = ?`;
      params.push(author_id);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM announcements a
      LEFT JOIN users u ON a.created_by = u.id
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get announcements with pagination
    const announcementsQuery = `
      SELECT 
        a.*,
        u.first_name as author_first_name,
        u.last_name as author_last_name
      FROM announcements a
      LEFT JOIN users u ON a.created_by = u.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [announcements] = await pool.execute(announcementsQuery, [...params, parseInt(limit), offset]);

    res.json({
      success: true,
      data: announcements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements'
    });
  }
};

// Get announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        a.*,
        u.first_name as author_first_name,
        u.last_name as author_last_name
      FROM announcements a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.id = ?
    `;

    const [announcements] = await pool.execute(query, [id]);

    if (announcements.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.json({
      success: true,
      data: announcements[0]
    });

  } catch (error) {
    console.error('Get announcement by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcement'
    });
  }
};

// Create new announcement
const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      priority,
      target_audience,
      start_date,
      end_date,
      is_active = true
    } = req.body;

    const author_id = req.user.id;

    const query = `
      INSERT INTO announcements (
        title, content, category, priority, target_audience, 
        start_date, end_date, is_active, author_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      title, content, category, priority, target_audience,
      start_date, end_date, is_active, author_id
    ]);

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement'
    });
  }
};

// Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      category,
      priority,
      target_audience,
      start_date,
      end_date,
      is_active
    } = req.body;

    const query = `
      UPDATE announcements 
      SET title = ?, content = ?, category = ?, priority = ?, 
          target_audience = ?, start_date = ?, end_date = ?, 
          is_active = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await pool.execute(query, [
      title, content, category, priority, target_audience,
      start_date, end_date, is_active, id
    ]);

    res.json({
      success: true,
      message: 'Announcement updated successfully'
    });

  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update announcement'
    });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM announcements WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });

  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement'
    });
  }
};

// Get active announcements for public display
const getActiveAnnouncements = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;
    const currentDate = new Date().toISOString().split('T')[0];

    let whereClause = 'WHERE a.is_published = 1 AND (a.publish_date IS NULL OR a.publish_date <= ?) AND (a.expiry_date IS NULL OR a.expiry_date >= ?)';
    const params = [currentDate, currentDate];

    if (category) {
      whereClause += ' AND a.announcement_type = ?';
      params.push(category);
    }

    const query = `
      SELECT 
        a.id, a.title, a.content, a.announcement_type, 
        a.target_audience, a.publish_date, a.expiry_date, a.created_at,
        u.first_name as author_first_name,
        u.last_name as author_last_name
      FROM announcements a
      LEFT JOIN users u ON a.created_by = u.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT ?
    `;

    const [announcements] = await pool.execute(query, [...params, parseInt(limit)]);

    res.json({
      success: true,
      data: announcements
    });

  } catch (error) {
    console.error('Get active announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active announcements'
    });
  }
};

// Get announcement categories
const getAnnouncementCategories = async (req, res) => {
  try {
    const query = 'SELECT DISTINCT category FROM announcements WHERE category IS NOT NULL ORDER BY category';
    const [categories] = await pool.execute(query);

    res.json({
      success: true,
      data: categories.map(row => row.category)
    });

  } catch (error) {
    console.error('Get announcement categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcement categories'
    });
  }
};

// Get announcement statistics
const getAnnouncementStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_announcements,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_announcements,
        COUNT(CASE WHEN is_active = 0 THEN 1 END) as inactive_announcements,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_count,
        COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority_count,
        COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority_count,
        COUNT(CASE WHEN category = 'general' THEN 1 END) as general_count,
        COUNT(CASE WHEN category = 'academic' THEN 1 END) as academic_count,
        COUNT(CASE WHEN category = 'practicum' THEN 1 END) as practicum_count,
        COUNT(CASE WHEN category = 'event' THEN 1 END) as event_count
      FROM announcements
    `;

    const [stats] = await pool.execute(query);

    res.json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error('Get announcement stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcement statistics'
    });
  }
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
  getAnnouncementCategories,
  getAnnouncementStats
};
