const express = require('express');
const router = express.Router();
const TaskManager = require('../models/Task');
const GoogleSheetsDB = require('../config/googleSheets');

// Initialize demo tasks on first load
TaskManager.initializeDemoTasks();

// Get tasks by assignee name (MUST be before /:role route)
router.get('/assignee/:name', (req, res) => {
  try {
    const { name } = req.params;
    const tasks = TaskManager.getTasksByAssignee(name);
    
    const summary = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length
    };
    
    res.json({ success: true, tasks, summary });
  } catch (error) {
    console.error('Get tasks by assignee error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tasks (for managers/owners)
router.get('/all/tasks', (req, res) => {
  try {
    const tasks = TaskManager.getAllTasks();
    
    const summary = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
    };
    
    res.json({ success: true, tasks, summary });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks for a user/role
router.get('/:role', (req, res) => {
  try {
    const { role } = req.params;
    const { status } = req.query;
    
    const filters = { role };
    if (status) filters.status = status;
    
    const tasks = TaskManager.getTasks(filters);
    
    res.json({
      success: true,
      tasks,
      summary: {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const taskData = req.body;
    
    // Try Google Sheets first, then fallback to local
    const sheetsTask = await GoogleSheetsDB.createTask(taskData);
    const localTask = TaskManager.createTask(taskData);
    
    const task = sheetsTask || localTask;
    
    res.json({
      success: true,
      task,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task status
router.patch('/:taskId/status', (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, statusNote, updatedBy } = req.body;
    
    const task = TaskManager.updateTaskStatus(parseInt(taskId), status, statusNote, updatedBy);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({
      success: true,
      task,
      message: `Task marked as ${status}`
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// Get task summary for dashboard
router.get('/summary/:role', (req, res) => {
  try {
    const { role } = req.params;
    const allTasks = TaskManager.getTasks({ role });
    
    const summary = {
      total: allTasks.length,
      pending: allTasks.filter(t => t.status === 'pending').length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      inProgress: allTasks.filter(t => t.status === 'in-progress').length,
      highPriority: allTasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
    };
    
    res.json({ success: true, summary });
  } catch (error) {
    console.error('Task summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;