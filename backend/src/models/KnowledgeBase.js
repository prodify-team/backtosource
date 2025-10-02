// Knowledge Base Management System
class KnowledgeBaseManager {
  constructor() {
    this.documents = new Map(); // In production, use database
    this.categories = ['recipes', 'sops', 'training', 'policies', 'faqs', 'locations'];
    this.initializeDefaultKnowledge();
  }

  initializeDefaultKnowledge() {
    // Add some default knowledge
    this.addDocument({
      id: 'default-dal-makhani',
      title: 'Dal Makhani Recipe',
      category: 'recipes',
      content: `Dal Makhani - Back to Source Signature Dish
      
Ingredients:
- काली दाल (Black Lentils): 1 cup
- राजमा (Kidney Beans): 1/4 cup  
- मक्खन (Butter): 4 tbsp
- क्रीम (Heavy Cream): 1/2 cup
- अदरक-लहसुन पेस्ट: 2 tbsp
- टमाटर प्यूरी: 1 cup

Cooking Method:
1. Soak lentils for 8 hours
2. Pressure cook for 4-5 whistles
3. Slow cook for 4-6 hours on low heat
4. Add cream and butter before serving

Important: धीमी आंच पर पकाना जरूरी है authentic taste के लिए`,
      tags: ['dal', 'makhani', 'signature', 'recipe'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });

    this.addDocument({
      id: 'default-hygiene-sop',
      title: 'Kitchen Hygiene Standards',
      category: 'sops',
      content: `Kitchen Hygiene SOP - Back to Source

Daily Requirements:
1. हाथ धोना (Hand washing) - 20 seconds with soap before every task
2. Clean apron and hair net mandatory
3. No jewelry except wedding ring
4. Temperature checks: Cold storage 4°C, Hot food 65°C+

Food Safety:
- Raw and cooked food separate storage
- FIFO (First In, First Out) principle
- Cross-contamination prevention
- Regular equipment sanitization

Violations result in immediate action as per company policy.`,
      tags: ['hygiene', 'safety', 'kitchen', 'sop'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });
  }

  async addDocument(docData) {
    const document = {
      id: docData.id || `doc_${Date.now()}`,
      title: docData.title,
      category: docData.category,
      content: docData.content,
      tags: docData.tags || [],
      createdAt: docData.createdAt || new Date(),
      updatedAt: new Date(),
      isActive: docData.isActive !== undefined ? docData.isActive : true,
      uploadedBy: docData.uploadedBy || 'system',
      version: docData.version || 1
    };

    try {
      // Try to save to Google Sheets first
      const GoogleSheetsDB = require('../config/googleSheets');
      await GoogleSheetsDB.createKnowledgeDocument({
        title: document.title,
        category: document.category,
        content: document.content,
        tags: Array.isArray(document.tags) ? document.tags.join(', ') : document.tags,
        uploadedBy: document.uploadedBy
      });
      console.log(`📄 Document saved to Google Sheets: ${document.title} (${document.category})`);
    } catch (error) {
      console.log(`⚠️  Failed to save to Google Sheets, using local storage: ${error.message}`);
    }

    // Also save to local memory as backup
    this.documents.set(document.id, document);
    console.log(`📄 Document added: ${document.title} (${document.category})`);
    return document;
  }

  updateDocument(id, updates) {
    const document = this.documents.get(id);
    if (!document) return null;

    const updatedDoc = {
      ...document,
      ...updates,
      updatedAt: new Date(),
      version: document.version + 1
    };

    this.documents.set(id, updatedDoc);
    console.log(`📝 Document updated: ${updatedDoc.title}`);
    return updatedDoc;
  }

  deleteDocument(id) {
    const document = this.documents.get(id);
    if (!document) return false;

    this.documents.delete(id);
    console.log(`🗑️ Document deleted: ${document.title}`);
    return true;
  }

  getDocument(id) {
    return this.documents.get(id);
  }

  async getAllDocuments(filters = {}) {
    try {
      // First try Google Sheets database
      const GoogleSheetsDB = require('../config/googleSheets');
      
      // Ensure Google Sheets is initialized
      if (!GoogleSheetsDB.isInitialized) {
        await GoogleSheetsDB.initialize();
      }
      
      const sheetsResults = await GoogleSheetsDB.getAllKnowledgeDocuments(filters);
      
      if (sheetsResults && sheetsResults.length > 0) {
        console.log(`📚 Found ${sheetsResults.length} documents in Google Sheets`);
        return sheetsResults.map(result => ({
          id: result.id,
          title: result.title,
          category: result.category,
          content: result.content,
          tags: typeof result.tags === 'string' ? result.tags.split(', ') : (result.tags || []),
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          isActive: result.isActive === 'true',
          uploadedBy: result.uploadedBy,
          version: result.version
        }));
      }
    } catch (error) {
      console.log('⚠️  Google Sheets getAllDocuments failed, using local knowledge:', error.message);
    }

    // Fallback to in-memory documents
    let docs = Array.from(this.documents.values());

    if (filters.category) {
      docs = docs.filter(doc => doc.category === filters.category);
    }

    if (filters.isActive !== undefined) {
      docs = docs.filter(doc => doc.isActive === filters.isActive);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      docs = docs.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm) ||
        doc.content.toLowerCase().includes(searchTerm) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return docs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async searchKnowledge(query, category = null) {
    try {
      // First try Google Sheets database
      const GoogleSheetsDB = require('../config/googleSheets');
      
      // Ensure Google Sheets is initialized
      if (!GoogleSheetsDB.isInitialized) {
        await GoogleSheetsDB.initialize();
      }
      
      const sheetsResults = await GoogleSheetsDB.searchKnowledgeBase(query, category);
      
      if (sheetsResults && sheetsResults.length > 0) {
        console.log(`🔍 Found ${sheetsResults.length} results in Google Sheets for: ${query}`);
        return sheetsResults.map(result => ({
          id: result.id,
          title: result.title,
          category: result.category,
          content: result.content,
          tags: typeof result.tags === 'string' ? result.tags.split(', ') : (result.tags || []),
          relevanceScore: 10 // High score for database results
        }));
      }
    } catch (error) {
      console.log('⚠️  Google Sheets search failed, using local knowledge:', error.message);
    }

    // Fallback to in-memory search
    const searchTerm = query.toLowerCase();
    let relevantDocs = Array.from(this.documents.values())
      .filter(doc => doc.isActive);

    if (category) {
      relevantDocs = relevantDocs.filter(doc => doc.category === category);
    }

    // Score documents based on relevance
    const scoredDocs = relevantDocs.map(doc => {
      let score = 0;
      
      // Title match (highest priority)
      if (doc.title.toLowerCase().includes(searchTerm)) score += 10;
      
      // Tag match (high priority)
      doc.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm)) score += 5;
      });
      
      // Content match (medium priority)
      const contentMatches = (doc.content.toLowerCase().match(new RegExp(searchTerm, 'g')) || []).length;
      score += contentMatches * 2;
      
      return { ...doc, relevanceScore: score };
    });

    const results = scoredDocs
      .filter(doc => doc.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5); // Return top 5 most relevant

    console.log(`🔍 Found ${results.length} results in local knowledge for: ${query}`);
    return results;
  }

  async getKnowledgeStats() {
    try {
      // First try Google Sheets database
      const GoogleSheetsDB = require('../config/googleSheets');
      
      // Ensure Google Sheets is initialized
      if (!GoogleSheetsDB.isInitialized) {
        await GoogleSheetsDB.initialize();
      }
      
      const sheetsResults = await GoogleSheetsDB.getAllKnowledgeDocuments();
      
      if (sheetsResults && sheetsResults.length > 0) {
        console.log(`📊 Generating stats from ${sheetsResults.length} Google Sheets documents`);
        
        const docs = sheetsResults.map(result => ({
          id: result.id,
          title: result.title,
          category: result.category,
          isActive: result.isActive === 'TRUE' || result.isActive === 'true' || result.isActive === true,
          updatedAt: result.updatedAt
        }));
        
        const stats = {
          total: docs.length,
          active: docs.filter(d => d.isActive).length,
          byCategory: {},
          recentlyUpdated: docs
            .filter(d => d.isActive)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5)
        };

        this.categories.forEach(category => {
          stats.byCategory[category] = docs.filter(d => d.category === category && d.isActive).length;
        });

        return stats;
      }
    } catch (error) {
      console.log('⚠️  Google Sheets stats failed, using local stats:', error.message);
    }

    // Fallback to local documents
    const docs = Array.from(this.documents.values());
    const stats = {
      total: docs.length,
      active: docs.filter(d => d.isActive).length,
      byCategory: {},
      recentlyUpdated: docs
        .filter(d => d.isActive)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
    };

    this.categories.forEach(category => {
      stats.byCategory[category] = docs.filter(d => d.category === category && d.isActive).length;
    });

    return stats;
  }

  // Bulk operations
  bulkUpload(documents) {
    const results = {
      success: [],
      errors: []
    };

    documents.forEach(docData => {
      try {
        const doc = this.addDocument(docData);
        results.success.push(doc);
      } catch (error) {
        results.errors.push({
          title: docData.title,
          error: error.message
        });
      }
    });

    return results;
  }

  exportKnowledge(category = null) {
    let docs = Array.from(this.documents.values()).filter(d => d.isActive);
    
    if (category) {
      docs = docs.filter(d => d.category === category);
    }

    return {
      exportDate: new Date(),
      totalDocuments: docs.length,
      documents: docs
    };
  }
}

module.exports = new KnowledgeBaseManager();