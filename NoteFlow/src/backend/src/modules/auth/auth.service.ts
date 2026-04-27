import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { LoginInput, RegisterInput } from "./auth.validation";
import { UserModel } from "../../models/User.model";
import { RefreshTokenModel } from "../../models/RefreshToken.model";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
};

type AuthResult = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

function signAccessToken(userId: string, email: string) {
  const expiresIn: SignOptions["expiresIn"] =
    (process.env.ACCESS_TOKEN_EXPIRES ?? "15m") as SignOptions["expiresIn"];

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

function parseDurationToMs(value: string): number {
  // supports: 15m, 7d, 12h, 30s
  const match = /^(\d+)([smhd])$/.exec(value.trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2];
  if (unit === "s") return amount * 1000;
  if (unit === "m") return amount * 60 * 1000;
  if (unit === "h") return amount * 60 * 60 * 1000;
  return amount * 24 * 60 * 60 * 1000;
}

function getRefreshExpiryDate() {
  const raw = process.env.REFRESH_TOKEN_EXPIRES ?? "7d";
  return new Date(Date.now() + parseDurationToMs(raw));
}

function toAuthUser(user: {
  _id: { toString(): string };
  email: string;
  name?: string;
  avatar?: string | null;
}): AuthUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? "",
    avatar: user.avatar ?? null,
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await UserModel.findOne({ email: input.email }).lean();
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const created = await UserModel.create({
    email: input.email,
    passwordHash,
    name: "",
    avatar: null,
  });

  const userId = created._id.toString();
  const accessToken = signAccessToken(userId, created.email);
  const refreshToken = signRefreshToken(userId, created.email);

  await RefreshTokenModel.create({
    token: refreshToken,
    userId: created._id,
    expiresAt: getRefreshExpiryDate(),
  });

  return {
    user: toAuthUser(created),
    accessToken,
    refreshToken,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await UserModel.findOne({ email: input.email });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");

  const userId = user._id.toString();
  const accessToken = signAccessToken(userId, user.email);
  const refreshToken = signRefreshToken(userId, user.email);

  await RefreshTokenModel.create({
    token: refreshToken,
    userId: user._id,
    expiresAt: getRefreshExpiryDate(),
  });

  return {
    user: toAuthUser(user),
    accessToken,
    refreshToken,
  };
}

export async function refreshSession(oldRefreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}> {
  const payload = jwt.verify(
    oldRefreshToken,
    process.env.JWT_REFRESH_SECRET as string
  ) as { sub: string; email: string; type?: string };

  if (payload.type && payload.type !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  const exists = await RefreshTokenModel.findOne({ token: oldRefreshToken });
  if (!exists) {
    throw new Error("Refresh token revoked");
  }

  // rotation
  await RefreshTokenModel.deleteOne({ token: oldRefreshToken });

  const newAccessToken = signAccessToken(payload.sub, payload.email);
  const newRefreshToken = signRefreshToken(payload.sub, payload.email);

  await RefreshTokenModel.create({
    token: newRefreshToken,
    userId: exists.userId,
    expiresAt: getRefreshExpiryDate(),
  });
  const userDoc = await UserModel.findById(exists.userId).lean();
  if (!userDoc) {
    throw new Error("User not found");
  }
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: toAuthUser(userDoc),
  };
}

export async function revokeRefreshToken(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  await RefreshTokenModel.deleteOne({ token: refreshToken });
}