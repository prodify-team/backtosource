// Simple in-memory task storage for demo
class TaskManager {
  constructor() {
    this.tasks = [];
    this.taskIdCounter = 1;
  }

  createTask(taskData) {
    const task = {
      id: this.taskIdCounter++,
      title: taskData.title,
      description: taskData.description,
      assignedTo: taskData.assignedTo,
      assignedBy: taskData.assignedBy || 'System',
      role: taskData.role,
      priority: taskData.priority || 'medium',
      status: 'pending',
      statusNote: null,
      createdAt: new Date(),
      dueDate: taskData.dueDate || null,
      completedAt: null,
      lastUpdatedBy: null,
      lastUpdatedAt: null
    };
    
    this.tasks.push(task);
    return task;
  }

  getTasksByAssignee(assigneeName) {
    return this.tasks.filter(task => 
      task.assignedTo.toLowerCase().includes(assigneeName.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getAllTasks() {
    return this.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getTasks(filters = {}) {
    let filteredTasks = [...this.tasks];
    
    if (filters.assignedTo) {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === filters.assignedTo);
    }
    
    if (filters.role) {
      filteredTasks = filteredTasks.filter(task => task.role === filters.role);
    }
    
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    
    return filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  updateTaskStatus(taskId, status, statusNote = null, updatedBy = null) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.statusNote = statusNote;
      task.lastUpdatedBy = updatedBy;
      task.lastUpdatedAt = new Date();
      
      if (status === 'completed') {
        task.completedAt = new Date();
      }
      return task;
    }
    return null;
  }

  // Pre-populate with some demo tasks
  initializeDemoTasks() {
    const demoTasks = [
      {
        title: 'दाल मखनी तैयार करें',
        description: 'शाम के लिए दाल मखनी बनाएं - 4 घंटे slow cooking',
        assignedTo: 'राज',
        assignedBy: 'Manager',
        role: 'chef',
        priority: 'high'
      },
      {
        title: 'टेबल साफ करें',
        description: 'सभी टेबल साफ करके sanitize करें',
        assignedTo: 'अमित',
        assignedBy: 'Manager',
        role: 'waiter',
        priority: 'medium'
      },
      {
        title: 'Kitchen inventory check',
        description: 'Check spices and vegetables stock for tomorrow',
        assignedTo: 'प्रिया',
        assignedBy: 'Owner',
        role: 'manager',
        priority: 'high'
      },
      {
        title: 'Customer feedback review',
        description: 'Review today\'s customer feedback and respond',
        assignedTo: 'सुनील',
        assignedBy: 'Owner',
        role: 'manager',
        priority: 'low'
      },
      {
        title: 'Prepare vegetables for evening',
        description: 'Cut onions, tomatoes, and prepare masala',
        assignedTo: 'राज',
        assignedBy: 'Head Chef',
        role: 'chef',
        priority: 'medium'
      }
    ];

    demoTasks.forEach(task => this.createTask(task));
  }
}

module.exports = new TaskManager();