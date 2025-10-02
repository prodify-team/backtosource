#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { query, healthCheck } = require('../backend/src/config/database');

async function runMigrations() {
  console.log('🔄 Starting database migrations...');
  
  try {
    // Check database connection
    const health = await healthCheck();
    if (health.status !== 'healthy') {
      throw new Error('Database connection failed');
    }
    
    console.log('✅ Database connection established');
    console.log(`📊 Database version: ${health.version.split(' ')[0]} ${health.version.split(' ')[1]}`);
    
    // Create migrations table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Get list of executed migrations
    const executedResult = await query('SELECT filename FROM migrations ORDER BY id');
    const executedMigrations = executedResult.rows.map(row => row.filename);
    
    // Get list of migration files
    const migrationsDir = path.join(__dirname, '../backend/src/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`📁 Found ${migrationFiles.length} migration files`);
    console.log(`✅ Already executed: ${executedMigrations.length} migrations`);
    
    // Run pending migrations
    let executedCount = 0;
    
    for (const filename of migrationFiles) {
      if (!executedMigrations.includes(filename)) {
        console.log(`🔄 Executing migration: ${filename}`);
        
        const migrationPath = path.join(migrationsDir, filename);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        try {
          // Execute migration
          await query(migrationSQL);
          
          // Record migration as executed
          await query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
          
          console.log(`✅ Migration completed: ${filename}`);
          executedCount++;
        } catch (error) {
          console.error(`❌ Migration failed: ${filename}`);
          console.error(error.message);
          throw error;
        }
      }
    }
    
    if (executedCount === 0) {
      console.log('✅ All migrations are up to date');
    } else {
      console.log(`✅ Successfully executed ${executedCount} new migrations`);
    }
    
    // Show final database stats
    const tablesResult = await query(`
      SELECT schemaname, tablename, 
             pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      LIMIT 10
    `);
    
    console.log('\n📊 Database Tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   ${row.tablename}: ${row.size}`);
    });
    
    // Check if we have sample data
    const userCount = await query('SELECT COUNT(*) as count FROM users');
    const restaurantCount = await query('SELECT COUNT(*) as count FROM restaurants');
    
    console.log('\n📈 Current Data:');
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Restaurants: ${restaurantCount.rows[0].count}`);
    
    if (userCount.rows[0].count === '0') {
      console.log('\n💡 Tip: Run "npm run seed" to add sample data for testing');
    }
    
    console.log('\n🎉 Database migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--rollback')) {
  console.log('❌ Rollback functionality not implemented yet');
  console.log('💡 For now, manually drop tables or restore from backup');
  process.exit(1);
}

// Run migrations
runMigrations();