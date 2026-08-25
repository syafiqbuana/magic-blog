// components/article-list.tsx
import { extractFirstImageUrl, getPublishedArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card"; // Sesuaikan path tempat kamu menyimpan ArticleCard

export default async function ArticleList({ tenantSlug }: { tenantSlug?: string }) {
  // 1. Ambil data dari database
  const articles = await getPublishedArticles(tenantSlug);

  // 2. Tampilkan state kosong jika tidak ada artikel
  if (!articles || articles.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md bg-muted/10 text-muted-foreground">
        Belum ada artikel yang dipublikasikan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => {
        // --- PREPARASI DATA SESUAI PROPS CARD ---

        // 1. Ambil kategori pertama (jika ada), karena relasi kategori bentuknya array
        const categoryName = article.categories[0]?.name || "Uncategorized";

        // 2. Format tanggal ke bentuk yang lebih mudah dibaca (contoh: 24 Jun 2026)
        const formattedDate = new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(article.createdAt);

        // 3. Potong konten untuk dijadikan excerpt jika terlalu panjang
        // (Pastikan menghapus tag HTML jika content kamu mengandung format Rich Text)
        const plainTextContent = article.content?.replace(/<[^>]+>/g, '') || "";
        const excerpt = plainTextContent.length > 120 
          ? plainTextContent.substring(0, 120) + "..." 
          : plainTextContent;

        // 4. Ekstrak URL gambar pertama dari field Json
        const imageUrl = extractFirstImageUrl(article.images);

        return (
          <ArticleCard
            key={article.id}
            title={article.title}
            slug={article.slug}
            excerpt={excerpt}
            category={categoryName}
            date={formattedDate}
            imageUrl={imageUrl}
          />
        );
      })}
    </div>
  );
}