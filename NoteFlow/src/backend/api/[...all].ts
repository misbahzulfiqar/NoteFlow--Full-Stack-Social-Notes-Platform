import "dotenv/config";
import { app } from "../src/app";
import { connectMongo } from "../src/config/db";

let mongoReady: Promise<void> | null = null;

async function ensureMongo() {
  if (!mongoReady) {
    mongoReady = connectMongo();
  }
  await mongoReady;
}

export default async function handler(req: unknown, res: unknown) {
  try {
    await ensureMongo();
    return app(req as never, res as never);
  } catch (error) {
    console.error("Vercel handler bootstrap failed:", error);
    return (res as { status: (code: number) => { json: (body: { message: string }) => unknown } })
      .status(500)
      .json({ message: "Server bootstrap failed" });
  }
}
