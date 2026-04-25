import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongo";
import { verifyAccessToken } from "@/lib/server/auth/verifyAccessToken";
import { uploadImageBuffer } from "@/lib/server/services/uploadImageBuffer";
import { updateNoteCover } from "@/lib/server/notes/notes.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = verifyAccessToken(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ message: "Expected multipart form data" }, { status: 400 });
  }

  const file = formData.get("cover");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  try {
    await connectMongo();
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImageBuffer(buffer, "noteflow/covers");
    const note = await updateNoteCover(user.id, id, url);
    return NextResponse.json({ message: "Cover updated", note });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 },
    );
  }
}
