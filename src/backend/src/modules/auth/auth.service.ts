import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { LoginInput, RegisterInput } from "./auth.validation";

// Replace with your DB model/repo
type User = { id: string; email: string; passwordHash: string };
const fakeDb: User[] = []; // demo only

function signAccessToken(userId: string, email: string) {
    const expiresIn: SignOptions["expiresIn"] =
      (process.env.ACCESS_TOKEN_EXPIRES ?? "1h") as SignOptions["expiresIn"];
  
    return jwt.sign(
      { sub: userId, email, type: "access" },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn }
    );
  }
  
  function signRefreshToken(userId: string, email: string) {
    const expiresIn: SignOptions["expiresIn"] =
      (process.env.REFRESH_TOKEN_EXPIRES ?? "7d") as SignOptions["expiresIn"];
  
    return jwt.sign(
      { sub: userId, email, type: "refresh" },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn }
    );
  }

export async function registerUser(input: RegisterInput) {
  const existing = fakeDb.find((u) => u.email === input.email);
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(input.password, 12); // required
  const user: User = {
    id: crypto.randomUUID(),
    email: input.email,
    passwordHash,
  };
  fakeDb.push(user);

  const accessToken = signAccessToken(user.id, user.email);
  const refreshToken = signRefreshToken(user.id, user.email);

  return { user: { id: user.id, email: user.email }, accessToken, refreshToken };
}

export async function loginUser(input: LoginInput) {
  const user = fakeDb.find((u) => u.email === input.email);
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(input.password, user.passwordHash); // required
  if (!ok) throw new Error("Invalid credentials");

  const accessToken = signAccessToken(user.id, user.email);
  const refreshToken = signRefreshToken(user.id, user.email);

  return { user: { id: user.id, email: user.email }, accessToken, refreshToken };
}