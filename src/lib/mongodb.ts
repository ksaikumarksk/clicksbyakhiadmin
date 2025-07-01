import mongoose, { Mongoose } from "mongoose";

declare global {
  // Ensure globalThis has a mongoose cache (for development)
  // eslint-disable-next-line no-var
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

let cached = global.mongoose ?? { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function clientPromise(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });
  }

  

  cached.conn = await cached.promise;
  return cached.conn;
}

export default clientPromise;
