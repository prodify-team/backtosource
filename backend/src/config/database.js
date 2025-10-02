const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const createPool = () => {
  const config = {
    max: 20, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
  };

  if (process.env.NODE_ENV === 'production') {
    // Production configuration for Google Cloud SQL
    config.connectionString = process.env.DATABASE_URL;
    
    // SSL configuration for Cloud SQL
    if (process.env.DB_SSL_CERT) {
      config.ssl = {
        ca: process.env.DB_SSL_CA,
        key: process.env.DB_SSL_KEY,
        cert: process.env.DB_SSL_CERT,
        rejectUnauthorized: false
      };
    } else {
      // Use Cloud SQL Proxy
      config.ssl = false;
    }
  } else {
    // Development configuration
    config.host = process.env.DB_HOST || 'localhost';
    config.port = process.env.DB_PORT || 5432;
    config.database = process.env.DB_NAME || 'backtosource_dev';
    config.user = process.env.DB_USER || 'postgres';
    config.password = process.env.DB_PASSWORD || 'password';
    config.ssl = false;
  }

  return new Pool(config);
};

const pool = createPool();

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🔄 Closing database connections...');
  pool.end(() => {
    console.log('✅ Database connections closed');
    process.exit(0);
  });
});

// Helper function to execute queries with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Query executed:', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Helper function to get a client from the pool
const getClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('❌ Error getting database client:', error);
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Health check function
const healthCheck = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as version');
    return {
      status: 'healthy',
      timestamp: result.rows[0].current_time,
      version: result.rows[0].version,
      connections: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};

module.exports = {
  pool,
  query,
  getClient,
  transaction,
  healthCheck
};