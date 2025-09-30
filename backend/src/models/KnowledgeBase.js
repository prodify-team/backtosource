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

  addDocument(docData) {
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

  getAllDocuments(filters = {}) {
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

  searchKnowledge(query, category = null) {
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

    return scoredDocs
      .filter(doc => doc.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5); // Return top 5 most relevant
  }

  getKnowledgeStats() {
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