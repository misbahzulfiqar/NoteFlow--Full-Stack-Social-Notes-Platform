import { cloudinary } from "../config/cloudinary";
import { Readable } from "node:stream";

export async function uploadImageBuffer(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder }, // e.g. "noteflow/covers"
      (err, result) => {
        console.log("[cloudinary callback raw]", { err, result });
        if (err || !result?.secure_url) {
          const message =
            (err as { message?: string; error?: { message?: string } })?.message ||
            (err as { error?: { message?: string } })?.error?.message ||
            "Cloudinary upload failed";
          reject(new Error(message));
          return;
        }
        resolve(result.secure_url);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}