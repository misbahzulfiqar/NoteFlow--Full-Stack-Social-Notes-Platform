import { Schema, model, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 320,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof UserSchema>;
export const UserModel = model<UserDocument>("User", UserSchema);