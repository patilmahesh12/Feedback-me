import mongoose from 'mongoose';
import { getRequiredEnvVar } from './env';

const MONGODB_URI = getRequiredEnvVar('MONGODB_URI');

// Type-safe connection cache
interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: ConnectionCache = (global as any).mongoose || { conn: null, promise: null };

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,  // 5s timeout
      socketTimeoutMS: 30000,         // 30s socket timeout
    }).then(mongoose => {
      console.log('✅ MongoDB Connected');
      return mongoose;
    }).catch(err => {
      console.error('❌ MongoDB Connection Error:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset cache on error
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
export default dbConnect;