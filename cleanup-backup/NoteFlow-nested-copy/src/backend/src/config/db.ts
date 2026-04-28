import mongoose from "mongoose";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export async function connectMongo() {
  const uri = getRequiredEnv("MONGODB_URI");
  const dbName = getRequiredEnv("MONGODB_DB_NAME");
  await mongoose.connect(uri, { dbName });
  console.log("MongoDB connected 🚀🚀🚀🚀");
}