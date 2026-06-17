//app/[slug]/(protected)/admin/articles/edit/page.tsx

// app/[slug]/(protected)/admin/articles/edit/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleForm from "@/components/ArticlesForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = await params;

  // Fetch artikel beserta relasi kategorinya
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      categories: true, // Asumsi relasi di Prisma schema bernama 'categories'
    },
  });

  if (!article) {
    notFound();
  }

  // Formatting gambar (karena di database kamu mungkin array/JSON string, 
  // tapi di form memakai single string imageUrl)
// Formatting gambar
  let imageUrl = "";
  if (article.images) {
    if (typeof article.images === "string") {
      try {
        const parsed = JSON.parse(article.images);
        // Tambahkan fallback tipe data di sini juga untuk keamanan
        imageUrl = Array.isArray(parsed) ? String(parsed[0] || "") : article.images;
      } catch {
        imageUrl = article.images;
      }
    } else if (Array.isArray(article.images) && article.images.length > 0) {
      // FIX: Gunakan type assertion (as string) 
      // atau cek typeof untuk memastikan itu string
      const firstImage = article.images[0];
      imageUrl = typeof firstImage === "string" ? firstImage : "";
    }
  }

  // Siapkan data awal untuk dikirim ke Client Component
// Siapkan data awal untuk dikirim ke Client Component
  const initialData = {
    id: article.id,
    title: article.title,
    
    // PERBAIKAN 1: Gunakan Nullish Coalescing (??) 
    // Jika article.content adalah null, ubah menjadi string kosong ""
    content: article.content ?? "", 
    
    images: imageUrl,
    isPublished: article.isPublished,
    
    // PERBAIKAN 2: Ganti 'any' dengan tipe data object yang memiliki id berupa string
    categoryIds: article.categories.map((cat: { id: string }) => cat.id), 
  };
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold">Edit Article</h1>
      {/* Passing data ke form kita */}
      <ArticleForm initialData={initialData} />
    </div>
  );
}