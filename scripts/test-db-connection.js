// Script to test MongoDB connection
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

// Initialize dotenv
dotenv.config();

// Get MongoDB URI from environment or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goeurotrail';

// MongoDB connection options
const options = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5000, // 5 seconds
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log(`Connection string: ${maskConnectionString(MONGODB_URI)}`);
  
  try {
    const startTime = Date.now();
    await mongoose.connect(MONGODB_URI, options);
    const connectionTime = Date.now() - startTime;
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`Connection time: ${connectionTime}ms`);
    
    // Check DB stats
    const db = mongoose.connection.db;
    const stats = await db.stats();
    console.log('\nDatabase Information:');
    console.log(`Database: ${db.databaseName}`);
    console.log(`Size: ${formatBytes(stats.dataSize)}`);
    console.log(`Collections: ${stats.collections}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    if (collections.length > 0) {
      console.log('\nCollections:');
      for (const collection of collections) {
        console.log(`- ${collection.name}`);
      }
    }
    
    console.log('\n✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error(`Error: ${error.message}`);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\nPossible reasons:');
      console.error('- MongoDB server is not running');
      console.error('- Connection string is incorrect');
      console.error('- Network connectivity issues');
      console.error('- Firewall blocking the connection');
    }
    
    console.error('\nPlease check your MongoDB setup and try again.');
  } finally {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (err) {
      // Ignore disconnect errors
    }
    
    process.exit(0);
  }
}

// Helper function to mask connection string for security
function maskConnectionString(uri) {
  try {
    const url = new URL(uri);
    
    // If there's authentication info, mask the password
    if (url.username) {
      return uri.replace(/\/\/(.*):(.*)@/, `//${url.username}:****@`);
    }
    
    return uri;
  } catch (err) {
    // If URI parsing fails, return a generic masked string
    return uri.replace(/:\/\/(.*?)\//, '://*****/');
  }
}

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Call the test function
testConnection(); 