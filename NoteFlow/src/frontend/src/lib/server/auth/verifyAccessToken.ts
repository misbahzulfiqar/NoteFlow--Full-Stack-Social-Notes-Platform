import jwt from "jsonwebtoken";

export type AuthedUser = { id: string; email: string };

export function verifyAccessToken(authorization: string | null): AuthedUser | null {
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length).trim();
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) return null;
  try {
    const payload = jwt.verify(token, secret) as {
      sub: string;
      email: string;
      type?: string;
    };
    if (payload.type && payload.type !== "access") return null;
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
