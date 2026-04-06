const mongoose = require('mongoose');

let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    cachedConnection = connection;
    console.log('✓ MongoDB connected');
    return connection;
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    throw error;
  }
}

export function getCachedConnection() {
  return cachedConnection;
}
