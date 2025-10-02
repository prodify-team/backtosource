const { query, transaction } = require('../config/database');

// User Model
class User {
  static async create(userData) {
    const { phone, name, role, location, preferredLanguage = 'hindi' } = userData;
    
    const result = await query(`
      INSERT INTO users (phone, name, role, location, preferred_language)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [phone, name, role, location, preferredLanguage]);
    
    return result.rows[0];
  }

  static async findByPhone(phone) {
    const result = await query('SELECT * FROM users WHERE phone = $1', [phone]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async updateLastSeen(id) {
    await query('UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  }

  static async getByLocation(location) {
    const result = await query(`
      SELECT u.*, r.name as restaurant_name 
      FROM users u 
      LEFT JOIN restaurants r ON u.location = r.location_code 
      WHERE u.location = $1 AND u.is_active = true
    `, [location]);
    return result.rows;
  }

  static async getByRole(role) {
    const result = await query('SELECT * FROM users WHERE role = $1 AND is_active = true', [role]);
    return result.rows;
  }
}

// Task Model
class Task {
  static async create(taskData) {
    const { 
      title, 
      description, 
      assignedToId, 
      assignedById, 
      restaurantId, 
      priority = 'medium',
      dueDate,
      tags = []
    } = taskData;
    
    const result = await query(`
      INSERT INTO tasks (title, description, assigned_to_id, assigned_by_id, restaurant_id, priority, due_date, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [title, description, assignedToId, assignedById, restaurantId, priority, dueDate, tags]);
    
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(`
      SELECT t.*, 
             ua.name as assigned_to_name,
             ub.name as assigned_by_name,
             r.name as restaurant_name
      FROM tasks t
      JOIN users ua ON t.assigned_to_id = ua.id
      JOIN users ub ON t.assigned_by_id = ub.id
      LEFT JOIN restaurants r ON t.restaurant_id = r.id
      WHERE t.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async getByAssignee(userId, status = null) {
    let queryText = `
      SELECT t.*, 
             ua.name as assigned_to_name,
             ub.name as assigned_by_name,
             r.name as restaurant_name
      FROM tasks t
      JOIN users ua ON t.assigned_to_id = ua.id
      JOIN users ub ON t.assigned_by_id = ub.id
      LEFT JOIN restaurants r ON t.restaurant_id = r.id
      WHERE t.assigned_to_id = $1
    `;
    
    const params = [userId];
    
    if (status) {
      queryText += ' AND t.status = $2';
      params.push(status);
    }
    
    queryText += ' ORDER BY t.created_at DESC';
    
    const result = await query(queryText, params);
    return result.rows;
  }

  static async getByRestaurant(restaurantId, status = null) {
    let queryText = `
      SELECT t.*, 
             ua.name as assigned_to_name,
             ub.name as assigned_by_name,
             r.name as restaurant_name
      FROM tasks t
      JOIN users ua ON t.assigned_to_id = ua.id
      JOIN users ub ON t.assigned_by_id = ub.id
      LEFT JOIN restaurants r ON t.restaurant_id = r.id
      WHERE t.restaurant_id = $1
    `;
    
    const params = [restaurantId];
    
    if (status) {
      queryText += ' AND t.status = $2';
      params.push(status);
    }
    
    queryText += ' ORDER BY t.created_at DESC';
    
    const result = await query(queryText, params);
    return result.rows;
  }

  static async updateStatus(id, status, statusNote = null, userId = null) {
    return await transaction(async (client) => {
      // Update task status
      const updateResult = await client.query(`
        UPDATE tasks 
        SET status = $1, 
            status_note = $2, 
            completed_at = CASE WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `, [status, statusNote, id]);

      // Add task update record
      if (userId) {
        await client.query(`
          INSERT INTO task_updates (task_id, user_id, update_type, new_value, comment)
          VALUES ($1, $2, 'status_change', $3, $4)
        `, [id, userId, status, statusNote]);
      }

      return updateResult.rows[0];
    });
  }

  static async getTaskStats(restaurantId = null, userId = null) {
    let queryText = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'delayed' THEN 1 END) as delayed,
        COUNT(CASE WHEN priority = 'high' AND status != 'completed' THEN 1 END) as high_priority_pending
      FROM tasks
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (restaurantId) {
      queryText += ` AND restaurant_id = $${++paramCount}`;
      params.push(restaurantId);
    }
    
    if (userId) {
      queryText += ` AND assigned_to_id = $${++paramCount}`;
      params.push(userId);
    }
    
    const result = await query(queryText, params);
    return result.rows[0];
  }
}

// Knowledge Document Model
class KnowledgeDocument {
  static async create(docData) {
    const { 
      title, 
      category, 
      content, 
      tags = [], 
      uploadedById, 
      restaurantId = null,
      accessLevel = 'all'
    } = docData;
    
    const result = await query(`
      INSERT INTO knowledge_documents (title, category, content, tags, uploaded_by_id, restaurant_id, access_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, category, content, tags, uploadedById, restaurantId, accessLevel]);
    
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(`
      SELECT kd.*, u.name as uploaded_by_name, r.name as restaurant_name
      FROM knowledge_documents kd
      LEFT JOIN users u ON kd.uploaded_by_id = u.id
      LEFT JOIN restaurants r ON kd.restaurant_id = r.id
      WHERE kd.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async search(searchTerm, category = null, restaurantId = null, limit = 10) {
    let queryText = `
      SELECT kd.*, 
             u.name as uploaded_by_name,
             r.name as restaurant_name,
             ts_rank(to_tsvector('english', kd.title || ' ' || kd.content), plainto_tsquery('english', $1)) as relevance_score
      FROM knowledge_documents kd
      LEFT JOIN users u ON kd.uploaded_by_id = u.id
      LEFT JOIN restaurants r ON kd.restaurant_id = r.id
      WHERE kd.is_active = true
        AND (kd.restaurant_id IS NULL OR kd.restaurant_id = $2)
        AND to_tsvector('english', kd.title || ' ' || kd.content) @@ plainto_tsquery('english', $1)
    `;
    
    const params = [searchTerm, restaurantId];
    let paramCount = 2;
    
    if (category) {
      queryText += ` AND kd.category = $${++paramCount}`;
      params.push(category);
    }
    
    queryText += ` ORDER BY relevance_score DESC, kd.updated_at DESC LIMIT $${++paramCount}`;
    params.push(limit);
    
    const result = await query(queryText, params);
    return result.rows;
  }

  static async getByCategory(category, restaurantId = null) {
    const result = await query(`
      SELECT kd.*, u.name as uploaded_by_name, r.name as restaurant_name
      FROM knowledge_documents kd
      LEFT JOIN users u ON kd.uploaded_by_id = u.id
      LEFT JOIN restaurants r ON kd.restaurant_id = r.id
      WHERE kd.category = $1 
        AND kd.is_active = true
        AND (kd.restaurant_id IS NULL OR kd.restaurant_id = $2)
      ORDER BY kd.updated_at DESC
    `, [category, restaurantId]);
    return result.rows;
  }

  static async getAll(filters = {}) {
    let queryText = `
      SELECT kd.*, u.name as uploaded_by_name, r.name as restaurant_name
      FROM knowledge_documents kd
      LEFT JOIN users u ON kd.uploaded_by_id = u.id
      LEFT JOIN restaurants r ON kd.restaurant_id = r.id
      WHERE kd.is_active = true
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (filters.category) {
      queryText += ` AND kd.category = $${++paramCount}`;
      params.push(filters.category);
    }
    
    if (filters.restaurantId) {
      queryText += ` AND (kd.restaurant_id IS NULL OR kd.restaurant_id = $${++paramCount})`;
      params.push(filters.restaurantId);
    }
    
    queryText += ' ORDER BY kd.updated_at DESC';
    
    if (filters.limit) {
      queryText += ` LIMIT $${++paramCount}`;
      params.push(filters.limit);
    }
    
    const result = await query(queryText, params);
    return result.rows;
  }

  static async update(id, updates) {
    const setClause = [];
    const params = [];
    let paramCount = 0;
    
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        setClause.push(`${key} = $${++paramCount}`);
        params.push(updates[key]);
      }
    });
    
    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }
    
    params.push(id);
    const queryText = `
      UPDATE knowledge_documents 
      SET ${setClause.join(', ')}, version = version + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${++paramCount}
      RETURNING *
    `;
    
    const result = await query(queryText, params);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('UPDATE knowledge_documents SET is_active = false WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async getStats() {
    const result = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active,
        COUNT(CASE WHEN category = 'recipes' AND is_active = true THEN 1 END) as recipes,
        COUNT(CASE WHEN category = 'sops' AND is_active = true THEN 1 END) as sops,
        COUNT(CASE WHEN category = 'training' AND is_active = true THEN 1 END) as training,
        COUNT(CASE WHEN category = 'policies' AND is_active = true THEN 1 END) as policies,
        COUNT(CASE WHEN category = 'faqs' AND is_active = true THEN 1 END) as faqs,
        COUNT(CASE WHEN category = 'locations' AND is_active = true THEN 1 END) as locations
      FROM knowledge_documents
    `);
    return result.rows[0];
  }
}

// Conversation Model (for analytics)
class Conversation {
  static async create(conversationData) {
    const { 
      userId, 
      sessionId, 
      message, 
      response, 
      intent, 
      confidence, 
      responseTimeMs,
      knowledgeDocumentsUsed = []
    } = conversationData;
    
    const result = await query(`
      INSERT INTO conversations (user_id, session_id, message, response, intent, confidence, response_time_ms, knowledge_documents_used)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [userId, sessionId, message, response, intent, confidence, responseTimeMs, knowledgeDocumentsUsed]);
    
    return result.rows[0];
  }

  static async getAnalytics(restaurantId = null, days = 30) {
    let queryText = `
      SELECT 
        COUNT(*) as total_conversations,
        AVG(response_time_ms) as avg_response_time,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(CASE WHEN confidence > 0.8 THEN 1 END) as high_confidence_responses,
        AVG(feedback_rating) as avg_rating
      FROM conversations c
      JOIN users u ON c.user_id = u.id
      WHERE c.created_at >= CURRENT_DATE - INTERVAL '${days} days'
    `;
    
    const params = [];
    
    if (restaurantId) {
      queryText += ' AND u.location = (SELECT location_code FROM restaurants WHERE id = $1)';
      params.push(restaurantId);
    }
    
    const result = await query(queryText, params);
    return result.rows[0];
  }
}

// Restaurant Model
class Restaurant {
  static async getAll() {
    const result = await query('SELECT * FROM restaurants WHERE is_active = true ORDER BY name');
    return result.rows;
  }

  static async findByLocationCode(locationCode) {
    const result = await query('SELECT * FROM restaurants WHERE location_code = $1', [locationCode]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query('SELECT * FROM restaurants WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = {
  User,
  Task,
  KnowledgeDocument,
  Conversation,
  Restaurant
};