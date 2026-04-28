import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

import { app } from "../../../../backend/src/app";
import { connectMongo } from "../../../../backend/src/config/db";

dotenv.config({
  path: path.resolve(process.cwd(), "../backend/.env"),
});

let connectPromise: Promise<void> | null = null;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await ensureMongoConnection();
  return app(req, res);
}
