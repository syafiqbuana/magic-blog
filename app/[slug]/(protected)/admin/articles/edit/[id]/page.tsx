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
  let imageUrl = "";
  if (article.images) {
    if (typeof article.images === "string") {
      try {
        const parsed = JSON.parse(article.images);
        imageUrl = Array.isArray(parsed) ? parsed[0] : article.images;
      } catch {
        imageUrl = article.images;
      }
    } else if (Array.isArray(article.images)) {
      imageUrl = article.images[0];
    }
  }

  // Siapkan data awal untuk dikirim ke Client Component
  const initialData = {
    id: article.id,
    title: article.title,
    content: article.content,
    images: imageUrl,
    isPublished: article.isPublished,
    // Ambil ID dari masing-masing kategori
    categoryIds: article.categories.map((cat: any) => cat.id), 
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold">Edit Article</h1>
      {/* Passing data ke form kita */}
      <ArticleForm initialData={initialData} />
    </div>
  );
}