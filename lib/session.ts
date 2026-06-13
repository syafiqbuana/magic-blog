// lib/session.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

// Menggunakan React.cache untuk dedikasi request
export const getCurrentUser = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    return session?.user || null;
  } catch (error) {
    console.error("Gagal mengambil session:", error);
    return null;
  }
});