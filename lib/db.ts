import mongoose, { Connection } from "mongoose";

declare global {
  // Extend NodeJS global type only once
  // Prevent TypeScript error in hot reload
  // eslint-disable-next-line no-var
  var mongooseConnection:
    | {
        conn: Connection | null;
        promise: Promise<Connection> | null;
      }
    | undefined;
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ Please define MONGO_URI in your .env file");
}

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

async function dbConnect(): Promise<Connection> {
  if (!cached) {
    throw new Error("Cached mongoose connection is undefined.");
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI as string, { bufferCommands: false })
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
