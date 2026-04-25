import mongoose, { Schema, model, Types, type InferSchemaType } from "mongoose";

const PasswordResetTokenSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    usedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type PasswordResetTokenDocument = InferSchemaType<typeof PasswordResetTokenSchema>;
export const PasswordResetTokenModel =
  (mongoose.models.PasswordResetToken as mongoose.Model<PasswordResetTokenDocument> | undefined) ??
  model<PasswordResetTokenDocument>("PasswordResetToken", PasswordResetTokenSchema);
