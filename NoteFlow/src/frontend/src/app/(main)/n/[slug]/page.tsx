"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicNoteDetailPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/notes/public");
  }, [router]);
  return null;
}
