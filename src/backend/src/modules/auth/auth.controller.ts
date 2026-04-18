import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { loginUser, registerUser } from "./auth.service";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function registerController(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const { user, accessToken, refreshToken } = await registerUser(parsed.data);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(201).json({
      message: "Registered successfully",
      user,
      accessToken, // required
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
      errors: parsed.error.flatten(),
    });
  }

  try {
    const { user, accessToken, refreshToken } = await loginUser(parsed.data);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(200).json({
      message: "Logged in successfully",
      user,
      accessToken, // required
    });
  } catch {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}