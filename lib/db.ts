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

export async function connectToDatabse() {
  if (cached.conn) cached.conn;

  if (!cached.promise) {
    const opts={
        maxPoolSize: 10,
        bufferCommands: true
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
