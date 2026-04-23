import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { loginUser, refreshSession, registerUser } from "./auth.service";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function registerController(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const { user, accessToken, refreshToken } = await registerUser(parsed.data);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(201).json({
      message: "Registered successfully",
      user,
      accessToken,
    });
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
}

export async function loginController(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const { user, accessToken, refreshToken } = await loginUser(parsed.data);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Logged in successfully",
      user,
      accessToken,
    });
  } catch {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}

export async function refreshController(req: Request, res: Response) {
  const oldRefreshToken = req.cookies?.refreshToken;
  if (!oldRefreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { accessToken, refreshToken, user } = await refreshSession(oldRefreshToken);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  return res.status(200).json({ accessToken, user });
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}