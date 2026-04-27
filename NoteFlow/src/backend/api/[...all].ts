import "dotenv/config";
import mongoose from "mongoose";

import { app } from "../src/app";
import { connectMongo } from "../src/config/db";

let connectPromise: Promise<void> | null = null;

async function ensureMongoConnection() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectPromise) {
    connectPromise = connectMongo().finally(() => {
      connectPromise = null;
    });
  }

  await connectPromise;
}

export default async function handler(req: unknown, res: unknown) {
  await ensureMongoConnection();
  return app(req as never, res as never);
}
