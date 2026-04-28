import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import notesRoutes from "./modules/notes/notes.routes";
import usersRoutes from "./modules/users/users.routes";
import favoritesRoutes from "./modules/favorites/favorites.routes";
import feedRoutes from "./modules/feed/feed.routes";
import { errorMiddleware } from "./middleware/error.middleware";

export const app = express();

const fromEnv =
  process.env.CLIENT_URL ??
  process.env.CLIENT_ORIGINS ??
  "http://localhost:3000";
const corsOrigins = fromEnv
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length <= 1 ? corsOrigins[0] ?? true : corsOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/favorites", favoritesRoutes);

app.use(errorMiddleware);
