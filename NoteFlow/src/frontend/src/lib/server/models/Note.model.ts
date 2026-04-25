import mongoose, { Schema, model, Types, type InferSchemaType } from "mongoose";

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      default: "",
      maxlength: 200000,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: null,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      index: true,
    },
    likes: {
      type: [Types.ObjectId],
      ref: "User",
      default: [],
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

NoteSchema.index({ slug: 1 }, { unique: true });
NoteSchema.index({ owner: 1, createdAt: -1 });

export type NoteDocument = InferSchemaType<typeof NoteSchema>;
export const NoteModel =
  (mongoose.models.Note as mongoose.Model<NoteDocument> | undefined) ??
  model<NoteDocument>("Note", NoteSchema);
