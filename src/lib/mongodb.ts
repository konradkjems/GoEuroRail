import mongoose from 'mongoose';
import { ensureModelsRegistered } from './models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goeurotrail';
const ENV_DB_NAME = process.env.DB_NAME || 'goeurotrail';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Extract database name from connection string or use default
function getDatabaseName(uri: string): string {
  try {
    // First check if we have an environment variable override
    if (ENV_DB_NAME) {
      console.log(`Using database name from environment: ${ENV_DB_NAME}`);
      return ENV_DB_NAME;
    }
    
    // For standard MongoDB connection strings
    if (uri.includes('mongodb://')) {
      const parts = uri.split('/');
      const lastPart = parts[parts.length - 1];
      // If there are query parameters, remove them
      const dbName = lastPart.split('?')[0];
      if (dbName && dbName !== '') return dbName;
    }
    
    // For MongoDB Atlas connection strings
    if (uri.includes('mongodb+srv://')) {
      // The database might be specified in the connection options
      const match = uri.match(/\/([^/?]+)(\?|$)/);
      if (match && match[1]) return match[1];
    }
    
    // Default database name
    return 'goeurotrail';
  } catch (error) {
    console.warn('Error extracting database name from URI, using default', error);
    return 'goeurotrail';
  }
}

// Get the database name
const DB_NAME = getDatabaseName(MONGODB_URI);
console.log(`Using database: ${DB_NAME}`);

// Connection options
const MONGODB_OPTIONS = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 8000, // Increased from 5 to 8 seconds
  connectTimeoutMS: 15000, // Increased from 10 to 15 seconds
  socketTimeoutMS: 60000, // Increased from 45 to 60 seconds
  dbName: DB_NAME, // Explicitly set the database name
};

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global as any;

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.mongoose.conn) {
    // Make sure models are registered even when reusing the connection
    ensureModelsRegistered();
    return cached.mongoose.conn;
  }

  if (!cached.mongoose.promise) {
    const opts = MONGODB_OPTIONS;

    cached.mongoose.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log(`MongoDB connected successfully to database: ${mongoose.connection.db.databaseName}`);
        // Ensure all models are registered
        ensureModelsRegistered();
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.mongoose.conn = await cached.mongoose.promise;
    return cached.mongoose.conn;
  } catch (error) {
    cached.mongoose.promise = null; // Reset the promise on error
    throw error; // Re-throw to be handled by the API route
  }
}

export default connectDB; 