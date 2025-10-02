-- Initial database schema for Back to Source Restaurant Management System
-- Run this script to create all necessary tables and indexes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'regional-manager', 'restaurant-manager', 'head-chef', 'chef', 'waiter', 'cashier', 'cleaner')),
    location VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'hindi' CHECK (preferred_language IN ('hindi', 'english')),
    is_active BOOLEAN DEFAULT true,
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    name VARCHAR(100) NOT NULL,
    location_code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    manager_id INTEGER REFERENCES users(id),
    settings JSONB DEFAULT '{}',
    operating_hours JSONB DEFAULT '{"open": "10:00", "close": "22:00"}',
    contact_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to_id INTEGER REFERENCES users(id),
    assigned_by_id INTEGER REFERENCES users(id),
    restaurant_id INTEGER REFERENCES restaurants(id),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled', 'delayed')),
    status_note TEXT,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    estimated_duration INTEGER, -- in minutes
    actual_duration INTEGER, -- in minutes
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge base documents table
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('recipes', 'sops', 'training', 'policies', 'faqs', 'locations')),
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    uploaded_by_id INTEGER REFERENCES users(id),
    restaurant_id INTEGER REFERENCES restaurants(id), -- NULL for global documents
    version INTEGER DEFAULT 1,
    parent_document_id INTEGER REFERENCES knowledge_documents(id), -- For versioning
    file_path VARCHAR(500), -- If document is a file
    file_size INTEGER,
    file_type VARCHAR(50),
    access_level VARCHAR(20) DEFAULT 'all' CHECK (access_level IN ('all', 'managers', 'location-specific')),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat conversations table (for analytics and training)
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(100),
    message TEXT NOT NULL,
    response TEXT,
    intent VARCHAR(100),
    confidence DECIMAL(3,2),
    response_time_ms INTEGER,
    knowledge_documents_used INTEGER[], -- Array of document IDs used for response
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comment TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    user_id INTEGER REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task comments/updates table
CREATE TABLE IF NOT EXISTS task_updates (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    update_type VARCHAR(50) NOT NULL CHECK (update_type IN ('comment', 'status_change', 'assignment', 'due_date_change')),
    old_value TEXT,
    new_value TEXT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    user_id INTEGER REFERENCES users(id),
    restaurant_id INTEGER REFERENCES restaurants(id),
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,2),
    metric_data JSONB DEFAULT '{}',
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    action_url VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    expires_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_last_seen ON users(last_seen);

-- Restaurant indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_location_code ON restaurants(location_code);
CREATE INDEX IF NOT EXISTS idx_restaurants_manager ON restaurants(manager_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON restaurants(is_active);

-- Task indexes
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_by ON tasks(assigned_by_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_restaurant ON tasks(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status_restaurant ON tasks(status, restaurant_id);

-- Knowledge base indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_documents(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_active ON knowledge_documents(is_active);
CREATE INDEX IF NOT EXISTS idx_knowledge_restaurant ON knowledge_documents(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_uploaded_by ON knowledge_documents(uploaded_by_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_tags ON knowledge_documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_access_level ON knowledge_documents(access_level);

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_content_search ON knowledge_documents 
USING GIN(to_tsvector('english', title || ' ' || content));

CREATE INDEX IF NOT EXISTS idx_tasks_content_search ON tasks 
USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Conversation indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_intent ON conversations(intent);

-- Session indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(is_active);

-- Task updates indexes
CREATE INDEX IF NOT EXISTS idx_task_updates_task ON task_updates(task_id);
CREATE INDEX IF NOT EXISTS idx_task_updates_user ON task_updates(user_id);
CREATE INDEX IF NOT EXISTS idx_task_updates_type ON task_updates(update_type);
CREATE INDEX IF NOT EXISTS idx_task_updates_created_at ON task_updates(created_at);

-- Performance metrics indexes
CREATE INDEX IF NOT EXISTS idx_metrics_user ON performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_metrics_restaurant ON performance_metrics(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_metrics_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_metrics_period ON performance_metrics(period_start, period_end);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_documents_updated_at BEFORE UPDATE ON knowledge_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default restaurants
INSERT INTO restaurants (name, location_code, address, city, state, settings) VALUES
('Back to Source - Connaught Place', 'delhi-cp', 'Block A, Connaught Place', 'New Delhi', 'Delhi', '{"seating_capacity": 80, "phone": "+91-11-4567-8901"}'),
('Back to Source - Greater Kailash', 'delhi-gk', 'M Block Market, Greater Kailash I', 'New Delhi', 'Delhi', '{"seating_capacity": 60, "phone": "+91-11-4567-8902"}'),
('Back to Source - Bandra', 'mumbai-bandra', 'Linking Road, Bandra West', 'Mumbai', 'Maharashtra', '{"seating_capacity": 70, "phone": "+91-22-4567-8903"}'),
('Back to Source - Andheri', 'mumbai-andheri', 'Veera Desai Road, Andheri West', 'Mumbai', 'Maharashtra', '{"seating_capacity": 65, "phone": "+91-22-4567-8904"}'),
('Back to Source - Koramangala', 'bangalore-koramangala', '5th Block, Koramangala', 'Bangalore', 'Karnataka', '{"seating_capacity": 75, "phone": "+91-80-4567-8905"}'),
('Back to Source - Indiranagar', 'bangalore-indiranagar', '100 Feet Road, Indiranagar', 'Bangalore', 'Karnataka', '{"seating_capacity": 55, "phone": "+91-80-4567-8906"}'),
('Back to Source - FC Road', 'pune-fc', 'Fergusson College Road', 'Pune', 'Maharashtra', '{"seating_capacity": 50, "phone": "+91-20-4567-8907"}'),
('Back to Source - Hi-Tech City', 'hyderabad-hitech', 'HITEC City, Madhapur', 'Hyderabad', 'Telangana', '{"seating_capacity": 85, "phone": "+91-40-4567-8908"}')
ON CONFLICT (location_code) DO NOTHING;

-- Create views for common queries
CREATE OR REPLACE VIEW active_users AS
SELECT u.*, r.name as restaurant_name, r.location_code
FROM users u
LEFT JOIN restaurants r ON u.location = r.location_code
WHERE u.is_active = true;

CREATE OR REPLACE VIEW pending_tasks AS
SELECT t.*, 
       ua.name as assigned_to_name,
       ub.name as assigned_by_name,
       r.name as restaurant_name
FROM tasks t
JOIN users ua ON t.assigned_to_id = ua.id
JOIN users ub ON t.assigned_by_id = ub.id
LEFT JOIN restaurants r ON t.restaurant_id = r.id
WHERE t.status IN ('pending', 'in-progress');

CREATE OR REPLACE VIEW task_performance AS
SELECT 
    u.name,
    u.role,
    r.name as restaurant_name,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_tasks,
    AVG(CASE WHEN t.status = 'completed' AND t.actual_duration IS NOT NULL 
        THEN t.actual_duration END) as avg_completion_time
FROM users u
LEFT JOIN tasks t ON u.id = t.assigned_to_id
LEFT JOIN restaurants r ON t.restaurant_id = r.id
WHERE u.is_active = true
GROUP BY u.id, u.name, u.role, r.name;

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

COMMENT ON TABLE users IS 'Store user information including staff members across all restaurant locations';
COMMENT ON TABLE restaurants IS 'Restaurant location information and settings';
COMMENT ON TABLE tasks IS 'Task management system for assigning and tracking work';
COMMENT ON TABLE knowledge_documents IS 'Knowledge base for recipes, SOPs, training materials';
COMMENT ON TABLE conversations IS 'Chat conversations for analytics and AI training';
COMMENT ON TABLE user_sessions IS 'User authentication sessions';
COMMENT ON TABLE task_updates IS 'Audit trail for task changes and comments';
COMMENT ON TABLE performance_metrics IS 'Performance tracking and analytics';
COMMENT ON TABLE notifications IS 'System notifications for users';