// Script to test MongoDB connection
// Run with: node scripts/test-db-connection.js

// Import required modules
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Get MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/webshop';

// Log environment information
console.log('=== MongoDB Connection Test ===');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`VERCEL_ENV: ${process.env.VERCEL_ENV || 'not on Vercel'}`);
console.log(`Connection string: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//\\$1:***@')}`);

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
};

// Attempt to connect to MongoDB
console.log('\nAttempting to connect to MongoDB...');

mongoose.connect(MONGO_URI, options)
  .then(async (connection) => {
    console.log('\n✅ MongoDB connected successfully!');
    console.log(`Database name: ${connection.connection.db.databaseName}`);
    
    // Get list of collections
    try {
      const collections = await connection.connection.db.listCollections().toArray();
      console.log('\nAvailable collections:');
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
      
      // Count documents in each collection
      console.log('\nCollection statistics:');
      for (const collection of collections) {
        const count = await connection.connection.db.collection(collection.name).countDocuments();
        console.log(`- ${collection.name}: ${count} documents`);
      }
    } catch (error) {
      console.error('Error listing collections:', error);
    }
    
    // Close the connection
    await mongoose.disconnect();
    console.log('\nConnection closed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ MongoDB connection error:', err);
    
    // Provide more detailed error information
    if (err.name === 'MongoNetworkError') {
      console.error('\nNetwork error detected. Possible causes:');
      console.error('- MongoDB server is not running');
      console.error('- Incorrect connection string');
      console.error('- Network connectivity issues');
      console.error('- Firewall blocking the connection');
      console.error('- If using MongoDB Atlas, check IP whitelist settings');
    } else if (err.name === 'MongoServerSelectionError') {
      console.error('\nServer selection error detected. Possible causes:');
      console.error('- MongoDB server is down or unreachable');
      console.error('- Incorrect credentials');
      console.error('- If using MongoDB Atlas, check if the cluster is active');
    }
    
    process.exit(1);
  });
