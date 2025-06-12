import mongoose from 'mongoose';

// Get MongoDB URI from environment variables with fallback for local development
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/webshop';

// Check if MONGO_URI is defined
if (!MONGO_URI) {
  console.error('MONGO_URI environment variable is not defined!');
  throw new Error('Please define the MONGO_URI environment variable');
}

// Log environment information for debugging
const isVercel = !!process.env.VERCEL;
const nodeEnv = process.env.NODE_ENV || 'development';
const vercelEnv = process.env.VERCEL_ENV || 'not on vercel';

console.log(`Database connection environment: NODE_ENV=${nodeEnv}, isVercel=${isVercel}, VERCEL_ENV=${vercelEnv}`);

// Cache the MongoDB connection to improve performance with serverless functions
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { 
    conn: null, 
    promise: null,
    connectionAttempts: 0
  };
}

async function dbConnect() {
  // If we already have a connection, return it
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }
  
  // If we're in the process of connecting, wait for that promise
  if (cached.promise) {
    console.log('Waiting for existing MongoDB connection promise to resolve...');
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (e) {
      console.error('Existing connection promise failed:', e);
      // Clear the failed promise so we can try again
      cached.promise = null;
    }
  }
  
  // Track connection attempts for debugging
  cached.connectionAttempts++;
  
  // Mask credentials in logs
  const maskedUri = MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//\$1:***@');
  console.log(`Connecting to MongoDB (attempt ${cached.connectionAttempts})... ${maskedUri}`);
  
  // Set connection options
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add these options for Vercel serverless environment
    bufferCommands: false,
    maxPoolSize: 10, // Adjust based on expected concurrent connections
    serverSelectionTimeoutMS: 10000, // Increase timeout for Vercel cold starts
  };
  
  // Create the connection promise
  cached.promise = mongoose.connect(MONGO_URI, options)
    .then((mongoose) => {
      console.log(`MongoDB connected successfully! Database: ${mongoose.connection.db.databaseName}`);
      return mongoose;
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      // Log more details about the error
      if (err.name === 'MongoNetworkError') {
        console.error('Network error - check if MongoDB Atlas IP whitelist includes Vercel IPs (0.0.0.0/0 recommended)');
      } else if (err.name === 'MongoServerSelectionError') {
        console.error('Server selection error - check if MongoDB Atlas is available and credentials are correct');
      }
      throw err;
    });
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error('Failed to resolve MongoDB connection:', e);
    // Clear the promise so subsequent calls can try again
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;
