import "dotenv/config";
import { connectMongo } from "./config/db";
import { app } from "./app";

async function bootstrap() {
  await connectMongo();
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running");
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});