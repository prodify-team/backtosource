# 🗄️ Database Setup Guide for Google Cloud

## Overview
Set up Cloud SQL PostgreSQL database for Back to Source system with proper schema, migrations, and connection pooling.

## 🚀 Quick Database Setup

### Step 1: Create Cloud SQL Instance
```bash
# Create PostgreSQL instance
gcloud sql instances create backtosource-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=asia-south1 \
    --storage-type=SSD \
    --storage-size=20GB \
    --storage-auto-increase \
    --backup-start-time=02:00 \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=03 \
    --maintenance-release-channel=production

# Set root password
gcloud sql users set-password postgres \
    --instance=backtosource-db \
    --password=YOUR_SECURE_PASSWORD
```

### Step 2: Create Application Database
```bash
# Create main database
gcloud sql databases create backtosource_prod \
    --instance=backtosource-db

# Create application user
gcloud sql users create app_user \
    --instance=backtosource-db \
    --password=YOUR_APP_PASSWORD
```

### Step 3: Configure Network Access
```bash
# Allow App Engine to connect
gcloud sql instances patch backtosource-db \
    --authorized-networks=0.0.0.0/0 \
    --assign-ip

# Get connection name
gcloud sql instances describe backtosource-db \
    --format="value(connectionName)"
```

## 📊 Database Schema

### Core Tables Structure
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'hindi',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants table
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location_code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    manager_id INTEGER REFERENCES users(id),
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to_id INTEGER REFERENCES users(id),
    assigned_by_id INTEGER REFERENCES users(id),
    restaurant_id INTEGER REFERENCES restaurants(id),
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending',
    status_note TEXT,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge base table
CREATE TABLE knowledge_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    uploaded_by_id INTEGER REFERENCES users(id),
    restaurant_id INTEGER REFERENCES restaurants(id),
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat conversations table (for analytics)
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    response TEXT,
    intent VARCHAR(100),
    confidence DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes for Performance
```sql
-- User indexes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_active ON users(is_active);

-- Task indexes
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to_id);
CREATE INDEX idx_tasks_assigned_by ON tasks(assigned_by_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_restaurant ON tasks(restaurant_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Knowledge base indexes
CREATE INDEX idx_knowledge_category ON knowledge_documents(category);
CREATE INDEX idx_knowledge_active ON knowledge_documents(is_active);
CREATE INDEX idx_knowledge_restaurant ON knowledge_documents(restaurant_id);
CREATE INDEX idx_knowledge_tags ON knowledge_documents USING GIN(tags);

-- Full text search on knowledge content
CREATE INDEX idx_knowledge_content_search ON knowledge_documents 
USING GIN(to_tsvector('english', title || ' ' || content));

-- Conversation indexes
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
```

## 🔧 Database Configuration Files

### Database Connection Pool
```javascript
// backend/src/config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
```

### Migration System
```javascript
// backend/src/migrations/001_initial_schema.js
const pool = require('../config/database');

async function up() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(15) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        location VARCHAR(100),
        preferred_language VARCHAR(10) DEFAULT 'hindi',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add other tables...
    
    await client.query('COMMIT');
    console.log('✅ Migration 001 completed');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function down() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    // Drop other tables...
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { up, down };
```

## 💰 Cost Optimization

### Database Sizing Recommendations

**For 350+ Users:**
- **Development**: `db-f1-micro` ($7/month)
- **Production**: `db-n1-standard-1` ($50/month)
- **High Traffic**: `db-n1-standard-2` ($100/month)

### Storage Optimization
```sql
-- Partition large tables by date
CREATE TABLE conversations_2024 PARTITION OF conversations
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Archive old data
DELETE FROM conversations WHERE created_at < NOW() - INTERVAL '6 months';
```

## 🔒 Security Best Practices

### Database Security
```bash
# Enable SSL
gcloud sql instances patch backtosource-db --require-ssl

# Create SSL certificates
gcloud sql ssl-certs create client-cert client-key.pem \
    --instance=backtosource-db

# Download certificates
gcloud sql ssl-certs describe client-cert \
    --instance=backtosource-db \
    --format="value(cert)" > client-cert.pem
```

### Connection Security
```javascript
// Secure connection configuration
const sslConfig = {
  ca: fs.readFileSync('server-ca.pem'),
  key: fs.readFileSync('client-key.pem'),
  cert: fs.readFileSync('client-cert.pem'),
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? sslConfig : false,
});
```

## 📊 Monitoring & Maintenance

### Performance Monitoring
```sql
-- Monitor slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check database size
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backup Strategy
```bash
# Automated backups (already configured)
gcloud sql backups list --instance=backtosource-db

# Manual backup
gcloud sql backups create --instance=backtosource-db

# Export to Cloud Storage
gcloud sql export sql backtosource-db gs://your-backup-bucket/backup-$(date +%Y%m%d).sql \
    --database=backtosource_prod
```

## 🚀 Deployment Integration

### Updated Environment Variables
```yaml
# backend/env_variables.yaml
env_variables:
  DATABASE_URL: "projects/backtosource-prod/secrets/database-url/versions/latest"
  DB_HOST: "projects/backtosource-prod/secrets/db-host/versions/latest"
  DB_NAME: "backtosource_prod"
  DB_USER: "app_user"
  DB_PASSWORD: "projects/backtosource-prod/secrets/db-password/versions/latest"
```

### Migration on Deployment
```yaml
# cloudbuild.yaml - Add migration step
steps:
  # ... existing steps ...
  
  # Run database migrations
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['run', 'migrate']
    dir: 'backend'
    env:
      - 'DATABASE_URL=${_DATABASE_URL}'
```

## 🔄 Data Migration from In-Memory

### Migration Script
```javascript
// scripts/migrate-to-database.js
const pool = require('../backend/src/config/database');
const KnowledgeBase = require('../backend/src/models/KnowledgeBase');

async function migrateData() {
  console.log('🔄 Starting data migration...');
  
  // Migrate knowledge base documents
  const documents = KnowledgeBase.getAllDocuments();
  for (const doc of documents) {
    await pool.query(`
      INSERT INTO knowledge_documents (title, category, content, tags, version, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [doc.title, doc.category, doc.content, doc.tags, doc.version, doc.isActive, doc.createdAt, doc.updatedAt]);
  }
  
  console.log('✅ Migration completed');
}

migrateData().catch(console.error);
```

## 📱 Connection from App Engine

### Cloud SQL Proxy Configuration
```yaml
# backend/app.yaml
beta_settings:
  cloud_sql_instances: backtosource-prod:asia-south1:backtosource-db

env_variables:
  DATABASE_URL: "postgresql://app_user:password@/backtosource_prod?host=/cloudsql/backtosource-prod:asia-south1:backtosource-db"
```

---

**🎯 Result**: Your Back to Source system will have enterprise-grade PostgreSQL database with proper schema, indexing, security, and automatic backups!