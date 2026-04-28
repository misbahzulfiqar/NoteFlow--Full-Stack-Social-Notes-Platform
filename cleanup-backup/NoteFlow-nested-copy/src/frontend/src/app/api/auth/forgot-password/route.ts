import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "This endpoint was removed. Use the Express API service instead.",
    },
    { status: 410 }
  );
}
