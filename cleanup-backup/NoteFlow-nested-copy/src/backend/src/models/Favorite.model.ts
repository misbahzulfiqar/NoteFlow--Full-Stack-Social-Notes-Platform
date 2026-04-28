import { Schema, model, Types, type InferSchemaType } from "mongoose";

const FavoriteSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    noteId: {
      type: Types.ObjectId,
      ref: "Note",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, noteId: 1 }, { unique: true });

export type FavoriteDocument = InferSchemaType<typeof FavoriteSchema>;
export const FavoriteModel = model<FavoriteDocument>("Favorite", FavoriteSchema);