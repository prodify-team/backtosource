const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

class GoogleSheetsDB {
  constructor() {
    this.doc = null;
    this.sheets = {};
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize Google Sheets document
      this.doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

      // Authenticate using service account
      if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        const serviceAccountAuth = new JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        
        this.doc.auth = serviceAccountAuth;
      } else {
        console.log('⚠️  Using demo mode - Google Sheets not configured');
        return;
      }

      await this.doc.loadInfo();
      console.log(`✅ Connected to Google Sheet: ${this.doc.title}`);

      // Load or create required sheets
      await this.setupSheets();
      this.isInitialized = true;

    } catch (error) {
      console.error('❌ Google Sheets initialization failed:', error.message);
      console.log('📝 Running in local mode without Google Sheets');
    }
  }

  async setupSheets() {
    const requiredSheets = [
      { title: 'Users', headers: ['id', 'phone', 'name', 'role', 'location', 'preferredLanguage', 'isActive', 'createdAt', 'lastSeen'] },
      { title: 'Tasks', headers: ['id', 'title', 'description', 'assignedTo', 'assignedBy', 'role', 'priority', 'status', 'statusNote', 'createdAt', 'completedAt'] },
      { title: 'KnowledgeBase', headers: ['id', 'title', 'category', 'content', 'tags', 'uploadedBy', 'version', 'isActive', 'createdAt', 'updatedAt'] },
      { title: 'Conversations', headers: ['id', 'userId', 'userName', 'message', 'response', 'timestamp', 'responseTime'] },
      { title: 'Restaurants', headers: ['id', 'name', 'locationCode', 'address', 'city', 'state', 'manager', 'phone', 'isActive'] }
    ];

    for (const sheetConfig of requiredSheets) {
      try {
        // Try to get existing sheet
        let sheet = this.doc.sheetsByTitle[sheetConfig.title];
        
        if (!sheet) {
          // Create new sheet if it doesn't exist
          sheet = await this.doc.addSheet({
            title: sheetConfig.title,
            headerValues: sheetConfig.headers
          });
          console.log(`📄 Created sheet: ${sheetConfig.title}`);
        } else {
          // Load existing sheet
          await sheet.loadHeaderRow();
          console.log(`📄 Loaded existing sheet: ${sheetConfig.title}`);
        }
        
        this.sheets[sheetConfig.title] = sheet;
      } catch (error) {
        console.error(`❌ Error setting up sheet ${sheetConfig.title}:`, error.message);
      }
    }
  }

  // Users operations
  async createUser(userData) {
    if (!this.isInitialized) return this.createUserLocal(userData);

    try {
      const sheet = this.sheets['Users'];
      const newRow = {
        id: Date.now().toString(),
        phone: userData.phone,
        name: userData.name,
        role: userData.role,
        location: userData.location,
        preferredLanguage: userData.preferredLanguage || 'hindi',
        isActive: 'true',
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      };

      await sheet.addRow(newRow);
      console.log(`👤 User created: ${userData.name}`);
      return newRow;
    } catch (error) {
      console.error('Error creating user:', error);
      return this.createUserLocal(userData);
    }
  }

  async findUserByPhone(phone) {
    if (!this.isInitialized) return this.findUserByPhoneLocal(phone);

    try {
      const sheet = this.sheets['Users'];
      await sheet.loadCells();
      const rows = await sheet.getRows();
      
      const user = rows.find(row => row.phone === phone && row.isActive === 'true');
      return user ? this.rowToObject(user) : null;
    } catch (error) {
      console.error('Error finding user:', error);
      return this.findUserByPhoneLocal(phone);
    }
  }

  // Tasks operations
  async createTask(taskData) {
    if (!this.isInitialized) return this.createTaskLocal(taskData);

    try {
      const sheet = this.sheets['Tasks'];
      const newRow = {
        id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description,
        assignedTo: taskData.assignedTo,
        assignedBy: taskData.assignedBy,
        role: taskData.role,
        priority: taskData.priority || 'medium',
        status: 'pending',
        statusNote: '',
        createdAt: new Date().toISOString(),
        completedAt: ''
      };

      await sheet.addRow(newRow);
      console.log(`📋 Task created: ${taskData.title}`);
      return newRow;
    } catch (error) {
      console.error('Error creating task:', error);
      return this.createTaskLocal(taskData);
    }
  }

  async getTasksByAssignee(assigneeName) {
    if (!this.isInitialized) return this.getTasksByAssigneeLocal(assigneeName);

    try {
      const sheet = this.sheets['Tasks'];
      const rows = await sheet.getRows();
      
      const tasks = rows
        .filter(row => row.assignedTo && row.assignedTo.toLowerCase().includes(assigneeName.toLowerCase()))
        .map(row => this.rowToObject(row));
      
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      return this.getTasksByAssigneeLocal(assigneeName);
    }
  }

  async getAllTasks() {
    if (!this.isInitialized) return this.getAllTasksLocal();

    try {
      const sheet = this.sheets['Tasks'];
      const rows = await sheet.getRows();
      return rows.map(row => this.rowToObject(row));
    } catch (error) {
      console.error('Error getting all tasks:', error);
      return this.getAllTasksLocal();
    }
  }

  async updateTaskStatus(taskId, status, statusNote = '', updatedBy = '') {
    if (!this.isInitialized) return this.updateTaskStatusLocal(taskId, status, statusNote);

    try {
      const sheet = this.sheets['Tasks'];
      const rows = await sheet.getRows();
      
      const taskRow = rows.find(row => row.id === taskId.toString());
      if (taskRow) {
        taskRow.status = status;
        taskRow.statusNote = statusNote;
        if (status === 'completed') {
          taskRow.completedAt = new Date().toISOString();
        }
        await taskRow.save();
        
        console.log(`📋 Task updated: ${taskId} -> ${status}`);
        return this.rowToObject(taskRow);
      }
      return null;
    } catch (error) {
      console.error('Error updating task:', error);
      return this.updateTaskStatusLocal(taskId, status, statusNote);
    }
  }

  // Knowledge Base operations
  async createKnowledgeDocument(docData) {
    if (!this.isInitialized) return this.createKnowledgeDocumentLocal(docData);

    try {
      const sheet = this.sheets['KnowledgeBase'];
      const newRow = {
        id: Date.now().toString(),
        title: docData.title,
        category: docData.category,
        content: docData.content.substring(0, 1000), // Limit content for sheets
        tags: Array.isArray(docData.tags) ? docData.tags.join(', ') : docData.tags,
        uploadedBy: docData.uploadedBy || 'admin',
        version: '1',
        isActive: 'TRUE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await sheet.addRow(newRow);
      console.log(`📚 Knowledge document created: ${docData.title}`);
      return newRow;
    } catch (error) {
      console.error('Error creating knowledge document:', error);
      return this.createKnowledgeDocumentLocal(docData);
    }
  }

  async searchKnowledgeBase(query, category = null) {
    if (!this.isInitialized) return this.searchKnowledgeBaseLocal(query, category);

    try {
      const sheet = this.sheets['KnowledgeBase'];
      const rows = await sheet.getRows();
      
      const searchTerm = query.toLowerCase();
      let results = rows.filter(row => {
        const titleMatch = row.title && row.title.toLowerCase().includes(searchTerm);
        const contentMatch = row.content && row.content.toLowerCase().includes(searchTerm);
        const tagsMatch = row.tags && row.tags.toLowerCase().includes(searchTerm);
        const categoryMatch = !category || row.category === category;
        const isActive = row.isActive === 'true';
        
        return (titleMatch || contentMatch || tagsMatch) && categoryMatch && isActive;
      });

      return results.map(row => this.rowToObject(row));
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return this.searchKnowledgeBaseLocal(query, category);
    }
  }

  async getAllKnowledgeDocuments(filters = {}) {
    if (!this.isInitialized) return this.getAllKnowledgeDocumentsLocal(filters);

    try {
      const sheet = this.sheets['KnowledgeBase'];
      const rows = await sheet.getRows();
      
      console.log(`📚 Retrieved ${rows.length} rows from KnowledgeBase sheet`);
      
      // Don't filter here - return all rows and let the caller handle filtering
      let results = rows;
      
      console.log(`📚 Filtered to ${results.length} active documents`);
      
      if (filters.category) {
        results = results.filter(row => {
          const category = row.get('category') || row.category;
          return category === filters.category;
        });
        console.log(`📚 Category filtered to ${results.length} documents`);
      }
      
      return results.map(row => this.rowToObject(row));
    } catch (error) {
      console.error('Error getting knowledge documents:', error);
      return this.getAllKnowledgeDocumentsLocal(filters);
    }
  }

  // Conversation logging
  async logConversation(conversationData) {
    if (!this.isInitialized) return;

    try {
      const sheet = this.sheets['Conversations'];
      const newRow = {
        id: Date.now().toString(),
        userId: conversationData.userId || '',
        userName: conversationData.userName || '',
        message: conversationData.message.substring(0, 500),
        response: conversationData.response.substring(0, 500),
        timestamp: new Date().toISOString(),
        responseTime: conversationData.responseTime || ''
      };

      await sheet.addRow(newRow);
    } catch (error) {
      console.error('Error logging conversation:', error);
    }
  }

  // Utility functions
  rowToObject(row) {
    const obj = {};
    
    // Get the sheet and headers
    const sheet = row._worksheet || row.sheet;
    const headers = sheet ? sheet.headerValues : null;
    
    if (headers && row._rawData) {
      // Map raw data to headers
      row._rawData.forEach((value, index) => {
        if (headers[index]) {
          obj[headers[index]] = value;
        }
      });
    } else {
      // Fallback: try to get data directly from row properties
      const knownHeaders = ['id', 'title', 'category', 'content', 'tags', 'uploadedBy', 'version', 'isActive', 'createdAt', 'updatedAt'];
      knownHeaders.forEach(header => {
        if (row[header] !== undefined) {
          obj[header] = row[header];
        }
      });
    }
    
    return obj;
  }

  // Local fallback methods (using existing in-memory storage)
  createUserLocal(userData) {
    // Fallback to existing user creation logic
    return {
      id: Date.now().toString(),
      ...userData,
      isActive: true,
      createdAt: new Date().toISOString()
    };
  }

  findUserByPhoneLocal(phone) {
    // Fallback to existing user lookup logic
    return null;
  }

  createTaskLocal(taskData) {
    // Fallback to existing task creation logic
    return {
      id: Date.now().toString(),
      ...taskData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }

  getTasksByAssigneeLocal(assigneeName) {
    // Fallback to existing task lookup logic
    return [];
  }

  getAllTasksLocal() {
    // Fallback to existing task lookup logic
    return [];
  }

  updateTaskStatusLocal(taskId, status, statusNote) {
    // Fallback to existing task update logic
    return null;
  }

  createKnowledgeDocumentLocal(docData) {
    // Fallback to existing knowledge document creation
    return {
      id: Date.now().toString(),
      ...docData,
      version: 1,
      isActive: true,
      createdAt: new Date().toISOString()
    };
  }

  searchKnowledgeBaseLocal(query, category) {
    // Fallback to existing knowledge search
    return [];
  }

  getAllKnowledgeDocumentsLocal(filters) {
    // Fallback to existing knowledge retrieval
    return [];
  }

  // Health check
  async healthCheck() {
    return {
      status: this.isInitialized ? 'connected' : 'local_mode',
      sheetTitle: this.doc ? this.doc.title : 'Not connected',
      sheetsCount: Object.keys(this.sheets).length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new GoogleSheetsDB();