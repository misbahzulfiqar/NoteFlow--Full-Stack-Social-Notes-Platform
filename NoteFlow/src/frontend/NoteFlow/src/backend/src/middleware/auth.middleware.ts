import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

type AccessJwtPayload = {
  sub: string;
  email: string;
  type?: string;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  try {
    const payload = jwt.verify(token, secret) as AccessJwtPayload;
    if (payload.type && payload.type !== "access") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}