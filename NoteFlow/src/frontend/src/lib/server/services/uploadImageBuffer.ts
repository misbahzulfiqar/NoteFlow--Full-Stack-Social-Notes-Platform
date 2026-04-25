import { Readable } from "node:stream";
import { cloudinary } from "@/lib/server/config/cloudinary";

export async function uploadImageBuffer(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err || !result?.secure_url) {
          const message =
            (err as { message?: string; error?: { message?: string } })?.message ||
            (err as { error?: { message?: string } })?.error?.message ||
            "Cloudinary upload failed";
          reject(new Error(message));
          return;
        }
        resolve(result.secure_url);
      },
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}
