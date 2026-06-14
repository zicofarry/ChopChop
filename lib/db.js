import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Register all models at import time (required for populate to work)
import '@/lib/models/Cafe';
import '@/lib/models/Category';
import '@/lib/models/Menu';
import '@/lib/models/Order';
import '@/lib/models/Payment';
import '@/lib/models/Table';
import '@/lib/models/Testimonial';
import '@/lib/models/User';

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
