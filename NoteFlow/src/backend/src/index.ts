import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import { connectMongo } from "./config/db";
import notesRoutes from "./modules/notes/notes.routes";
import usersRoutes from "./modules/users/users.routes";
import favoritesRoutes from "./modules/favorites/favorites.routes";


const app = express();

const corsOrigins = (process.env.CLIENT_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/favorites", favoritesRoutes);



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