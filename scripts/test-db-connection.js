// Quick script to test database connection
// Run with: node scripts/test-db-connection.js

require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Not set ✗');
    
    if (!process.env.DATABASE_URL) {
      console.error('\n❌ DATABASE_URL is not set in .env file');
      console.log('\nPlease add to your .env file:');
      console.log('DATABASE_URL="postgresql://user:password@localhost:5432/rbac_db?schema=public"');
      process.exit(1);
    }

    await prisma.$connect();
    console.log('✅ Successfully connected to database!');
    
    // Try a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query test passed!');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Tip: Check your DATABASE_URL credentials');
      console.log('   Format: postgresql://username:password@host:port/database');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Tip: Create the database first:');
      console.log('   CREATE DATABASE rbac_db;');
    } else if (error.message.includes('refused')) {
      console.log('\n💡 Tip: Make sure PostgreSQL is running');
      console.log('   On macOS: brew services start postgresql@14');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

