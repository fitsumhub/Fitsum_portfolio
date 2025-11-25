/**
 * Connection Test Script
 * Tests MongoDB and API server connectivity
 * 
 * Usage: node test-connection.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitsum_portfolio';
const apiURL = `http://localhost:${process.env.PORT || 5000}/api/health`;

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 Testing Connections...');
console.log('═══════════════════════════════════════════════════════════\n');

// Test MongoDB Connection
async function testMongoDB() {
  console.log('📊 Testing MongoDB Connection...');
  console.log(`   URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}\n`);
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    
    // Test with ping
    await conn.connection.db.admin().ping();
    
    console.log('✅ MongoDB Connection: SUCCESS');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.log('❌ MongoDB Connection: FAILED');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

// Test API Server
async function testAPIServer() {
  console.log('🌐 Testing API Server Connection...');
  console.log(`   URL: ${apiURL}\n`);
  
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Server Connection: SUCCESS');
      console.log(`   Status: ${data.data?.status || 'ok'}`);
      console.log(`   Database: ${data.data?.database?.status || 'unknown'}`);
      console.log(`   Uptime: ${data.data?.server?.uptime || 0}s\n`);
      return true;
    } else {
      console.log('⚠️  API Server: RESPONDED BUT DEGRADED');
      console.log(`   Status: ${data.data?.status || 'degraded'}`);
      console.log(`   Database: ${data.data?.database?.status || 'unknown'}\n`);
      return false;
    }
  } catch (error) {
    console.log('❌ API Server Connection: FAILED');
    console.log(`   Error: ${error.message}`);
    console.log(`   Make sure the server is running: npm run dev\n`);
    return false;
  }
}

// Run tests
async function runTests() {
  const mongoResult = await testMongoDB();
  const apiResult = await testAPIServer();
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📋 Test Results Summary:');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`MongoDB:     ${mongoResult ? '✅ Connected' : '❌ Failed'}`);
  console.log(`API Server:  ${apiResult ? '✅ Connected' : '❌ Failed'}`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  if (mongoResult && apiResult) {
    console.log('🎉 All connections successful! Your setup is ready to go.');
    process.exit(0);
  } else {
    console.log('⚠️  Some connections failed. Please check the errors above.');
    process.exit(1);
  }
}

runTests();

