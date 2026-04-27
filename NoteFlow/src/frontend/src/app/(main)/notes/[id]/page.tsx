"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrivateNoteDetailPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/notes/private");
  }, [router]);
  return null;
}
