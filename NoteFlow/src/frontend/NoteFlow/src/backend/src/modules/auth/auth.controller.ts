import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import {
  loginUser,
  refreshSession,
  registerUser,
  revokeRefreshToken,
} from "./auth.service";

function refreshCookieBase() {
  const defaultSameSite = "strict";
  const raw = (process.env.REFRESH_COOKIE_SAMESITE ?? defaultSameSite).toLowerCase();
  const sameSite: "strict" | "lax" | "none" =
    raw === "none" || raw === "lax" || raw === "strict" ? raw : "strict";
  const secure =
    sameSite === "none" ? true : process.env.NODE_ENV === "production";
  return { sameSite, secure };
}

const refreshCookieOptions = {
  httpOnly: true,
  ...refreshCookieBase(),
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearRefreshCookieOptions = {
  httpOnly: true,
  ...refreshCookieBase(),
  path: "/",
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

export async function logoutController(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  try {
    await revokeRefreshToken(token);
  } catch {
    /* ignore */
  }
  res.clearCookie("refreshToken", clearRefreshCookieOptions);
  return res.json({ message: "Logged out" });
}