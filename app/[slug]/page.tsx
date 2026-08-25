import { ArticleCard } from "@/components/article-card";
import {BlogSiteFooter} from "@/components/blog-site-footer";
import {BlogSiteHeader} from "@/components/blog-site-header";
import { Button } from "@/components/ui/button";
import { extractFirstImageUrl, getPublishedArticles, getTenantBySlug } from "@/lib/articles";
import { notFound } from "next/navigation";

export default async function BlogHomepage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Slug di URL harus cocok dengan blog (tenant) yang terdaftar,
  // jika tidak, tampilkan halaman 404.
  const tenant = await getTenantBySlug(slug);
  if (!tenant) {
    notFound();
  }

  // Query artikel yang dipublikasikan milik blog dengan slug ini saja.
  // Jika slug tidak dikenal, getPublishedArticles mengembalikan array kosong
  // (bukan artikel dari tenant lain).
  const articles = await getPublishedArticles(slug);

  return (
    <div className="flex flex-col min-h-screen bg-background font-mono">
      <BlogSiteHeader slug={slug} />

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Articles</h1>
          <p className="text-muted-foreground">Thoughts on software engineering, brutalist design, and the mechanics of minimal systems.</p>
        </div>

        {articles.length === 0 ? (
          /* Empty State: blog valid tetapi belum punya artikel publik */
          <div className="p-8 text-center border rounded-md bg-muted/10 text-muted-foreground">
            Belum ada artikel yang dipublikasikan.
          </div>
        ) : (
          <>
            {/* Grid of Blog Posts (2 kolom di desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article) => {
                // --- PREPARASI DATA SESUAI PROPS CARD ---

                // 1. Kategori pertama (relasi kategori berbentuk array)
                const categoryName = article.categories[0]?.name || "Uncategorized";

                // 2. Format tanggal (contoh: 24 Agu 2026)
                const formattedDate = new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(article.createdAt);

                // 3. Potong konten sebagai excerpt (buang tag HTML rich text)
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

            {/* Pagination / Load More */}
            <div className="mt-12 flex justify-center border-t border-border pt-8">
              <Button variant="outline" className="w-full uppercase font-bold tracking-widest h-12">
                Load More Archive
              </Button>
            </div>
          </>
        )}
      </main>

      <BlogSiteFooter slug={slug} />
    </div>
  );
}
