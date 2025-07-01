import { error } from "console";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please provide an valid mongodb connection ");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts={
        maxPoolSize: 10,
        bufferCommands: true // bufferCommands: true(default) means your app will queue database operations while establishing the connection, making it more resilient during startup.
    };
    
   cached.promise= mongoose
   .connect(MONGODB_URI,opts)
   .then(()=>mongoose.connection)
  }
  try {
   cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
