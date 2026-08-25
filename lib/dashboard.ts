// lib/dashboard.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation"; // Sesuaikan lokasi prisma

export async function getDashboardStat(slug?: string) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  console.log("getDashboardStat dipanggil dengan slug:", slug, "oleh user:", user.email);

  // SKENARIO 1: Konteks URL sedang berada di /superadmin (tidak ada parameter slug)
  if (!slug && user.isSuperadmin) {
    const totalUsers = await prisma.user.count({ where: { isSuperadmin: false } });
    const globalArticles = await prisma.article.count();

    return {
      viewType: "superadmin", // <--- Tandai ini tampilan superadmin
      totalUsers,
      globalArticles,
    };
  }

  // SKENARIO 2: Konteks URL berada di /[slug]/admin (ada parameter slug)
  // Berlaku untuk user biasa, ATAU superadmin yang sedang "impersonate" slug user lain
  let targetUserId = user.id;

  if (slug) {
    // Cari tahu siapa pemilik asli dari slug ini
    const profile = await prisma.userProfile.findUnique({
      where: { slug },
      select: { userId: true },
    });

    if (!profile){
      notFound();
    };
    
    // Ganti targetUserId dengan ID pemilik blog tersebut
    targetUserId = profile.userId; 
  }

  // Tarik statistik spesifik untuk targetUserId tersebut
  const totalArticles = await prisma.article.count({
    where: { userId: targetUserId },
  });
  const draftArticles = await prisma.article.count({
    where: { userId: targetUserId, isPublished: false },
  });
  const totalCategories = await prisma.category.count({
    where: { userId: targetUserId },
  });

  return {
    viewType: "tenant", // <--- Tandai ini tampilan user/tenant biasa
    totalArticles,
    draftArticles,
    totalCategories,
  };
}