import mongoose from "mongoose";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    const hint = process.env.VERCEL
      ? `Set ${name} in the Vercel project → Settings → Environment Variables, then redeploy.`
      : `Set ${name} in NoteFlow/src/backend/.env (loaded automatically for local dev) or in NoteFlow/src/frontend/.env.local.`;
    throw new Error(`Missing required env var: ${name}. ${hint}`);
  }
  return value;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as { mongooseCache?: MongooseCache };

function getCache(): MongooseCache {
  if (!globalForMongoose.mongooseCache) {
    globalForMongoose.mongooseCache = { conn: null, promise: null };
  }
  return globalForMongoose.mongooseCache;
}

/** Reuse connection across serverless invocations */
export async function connectMongo(): Promise<typeof mongoose> {
  const cached = getCache();
  if (cached.conn) return cached.conn;

  const uri = getRequiredEnv("MONGODB_URI");
  const dbName = getRequiredEnv("MONGODB_DB_NAME");

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { dbName }).then(() => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
