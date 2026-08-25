// lib/articles.ts
import { prisma } from "@/lib/prisma";

// Validasi apakah sebuah slug blog (tenant) benar-benar ada di database.
export async function getTenantBySlug(tenantSlug: string) {
  return prisma.userProfile.findUnique({
    where: { slug: tenantSlug },
    select: { userId: true, slug: true, fullname: true },
  });
}

// Ekstrak URL gambar pertama dari field Json `images` yang bentuknya bisa beragam:
// string URL langsung, JSON string '["url"]', array of string, atau object { url }.
export function extractFirstImageUrl(images: unknown): string | undefined {
  if (!images) return undefined;

  if (typeof images === "string") {
    try {
      const parsed: unknown = JSON.parse(images);
      if (Array.isArray(parsed)) {
        const first = parsed[0];
        return typeof first === "string" && first ? first : undefined;
      }
      return images;
    } catch {
      // Bukan JSON string, anggap langsung URL
      return images;
    }
  }

  // Bentuk yang dipakai ArticlesForm saat submit: [ "https://..." ]
  if (Array.isArray(images)) {
    const first = images[0];
    return typeof first === "string" && first ? first : undefined;
  }

  if (typeof images === "object" && "url" in (images as Record<string, unknown>)) {
    const url = (images as { url?: unknown }).url;
    return typeof url === "string" && url ? url : undefined;
  }

  return undefined;
}

export async function getPublishedArticles(tenantSlug?: string) {
  // Jika arsitektur kamu multi-tenant dan butuh filter berdasarkan pemilik blog
  let targetUserId = undefined;
  if (tenantSlug) {
    const profile = await prisma.userProfile.findUnique({
      where: { slug: tenantSlug },
      select: { userId: true },
    });
    // Slug tidak dikenal = bukan blog yang valid.
    // JANGAN fallback ke undefined (itu berarti mengambil artikel SEMUA tenant).
    if (!profile) return [];
    targetUserId = profile.userId;
  }

  // Fetch artikel
  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      ...(targetUserId && { userId: targetUserId }), // Filter spesifik user jika ada
    },
    orderBy: {
      createdAt: "desc", // Urutkan berdasarkan waktu dibuat (terbaru)
    },
    include: {
      categories: {
        select: { name: true }, // Ambil nama kategori
      },
    },
  });

  return articles;
}