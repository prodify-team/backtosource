const express = require('express');
const multer = require('multer');
const router = express.Router();
const KnowledgeBase = require('../models/KnowledgeBase');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow text files, markdown, and JSON
    const allowedTypes = ['text/plain', 'text/markdown', 'application/json'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.md') || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only text, markdown, and JSON files are allowed'));
    }
  }
});

// Get all documents
router.get('/documents', (req, res) => {
  try {
    const { category, search, active } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    if (search) filters.search = search;
    if (active !== undefined) filters.isActive = active === 'true';

    const documents = KnowledgeBase.getAllDocuments(filters);
    
    res.json({
      success: true,
      documents,
      total: documents.length,
      filters: filters
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single document
router.get('/documents/:id', (req, res) => {
  try {
    const document = KnowledgeBase.getDocument(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      success: true,
      document
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new document
router.post('/documents', (req, res) => {
  try {
    const { title, category, content, tags, uploadedBy } = req.body;
    
    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Title, category, and content are required' });
    }

    const document = KnowledgeBase.addDocument({
      title,
      category,
      content,
      tags: tags || [],
      uploadedBy: uploadedBy || 'admin'
    });

    res.json({
      success: true,
      document,
      message: 'Document added successfully'
    });
  } catch (error) {
    console.error('Add document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload document file
router.post('/upload', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, category, tags, uploadedBy } = req.body;
    const content = req.file.buffer.toString('utf8');

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const document = KnowledgeBase.addDocument({
      title,
      category,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      uploadedBy: uploadedBy || 'admin'
    });

    res.json({
      success: true,
      document,
      message: 'File uploaded and processed successfully'
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update document
router.put('/documents/:id', (req, res) => {
  try {
    const { title, category, content, tags, isActive } = req.body;
    
    const updates = {};
    if (title) updates.title = title;
    if (category) updates.category = category;
    if (content) updates.content = content;
    if (tags) updates.tags = tags;
    if (isActive !== undefined) updates.isActive = isActive;

    const document = KnowledgeBase.updateDocument(req.params.id, updates);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      success: true,
      document,
      message: 'Document updated successfully'
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete document
router.delete('/documents/:id', (req, res) => {
  try {
    const success = KnowledgeBase.deleteDocument(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search knowledge base
router.get('/search', (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = KnowledgeBase.searchKnowledge(q, category);
    
    res.json({
      success: true,
      query: q,
      category: category || 'all',
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get knowledge base statistics
router.get('/stats', (req, res) => {
  try {
    const stats = KnowledgeBase.getKnowledgeStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk upload documents
router.post('/bulk-upload', (req, res) => {
  try {
    const { documents } = req.body;
    
    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({ error: 'Documents array is required' });
    }

    const results = KnowledgeBase.bulkUpload(documents);
    
    res.json({
      success: true,
      results,
      message: `${results.success.length} documents uploaded, ${results.errors.length} errors`
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export knowledge base
router.get('/export', (req, res) => {
  try {
    const { category } = req.query;
    const exportData = KnowledgeBase.exportKnowledge(category);
    
    res.json({
      success: true,
      export: exportData
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get available categories
router.get('/categories', (req, res) => {
  try {
    const categories = ['recipes', 'sops', 'training', 'policies', 'faqs', 'locations'];
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;