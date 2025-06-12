import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/webshop';

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    console.log('Connecting to MongoDB...', MONGO_URI.replace(/\/\/(.*)@/, '//***@')); // Log connection attempt without exposing credentials
    cached.promise = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      console.log('MongoDB connected successfully!');
      return mongoose;
    }).catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error('Failed to resolve MongoDB connection:', e);
    throw e;
  }
}

export default dbConnect;
