import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { UserModel } from "@/lib/server/models/User.model";
import { PasswordResetTokenModel } from "@/lib/server/models/PasswordResetToken.model";
import { RefreshTokenModel } from "@/lib/server/models/RefreshToken.model";

const DEFAULT_EXPIRY_MINUTES = 15;

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function getExpiryMinutes(): number {
  const raw = Number(process.env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES ?? DEFAULT_EXPIRY_MINUTES);
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_EXPIRY_MINUTES;
  return Math.min(raw, 120);
}

function getOriginFromRequest(req: Request): string {
  const url = new URL(req.url);
  return url.origin;
}

export async function createPasswordResetRequest(
  email: string,
  req: Request,
): Promise<{ message: string; resetUrl?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await UserModel.findOne({ email: normalizedEmail }).lean();

  const message = "If that email exists, a reset link has been generated.";
  if (!user) return { message };

  await PasswordResetTokenModel.deleteMany({ userId: user._id });

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + getExpiryMinutes() * 60 * 1000);

  await PasswordResetTokenModel.create({
    userId: user._id,
    tokenHash,
    expiresAt,
    usedAt: null,
  });

  const resetUrl = `${getOriginFromRequest(req)}/reset-password?token=${token}`;
  return { message, resetUrl };
}

export async function resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
  const tokenHash = hashToken(token.trim());

  const record = await PasswordResetTokenModel.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new Error("Invalid or expired reset token");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await UserModel.updateOne({ _id: record.userId }, { $set: { passwordHash } });
  await RefreshTokenModel.deleteMany({ userId: record.userId });
  await PasswordResetTokenModel.updateOne({ _id: record._id }, { $set: { usedAt: new Date() } });
}
