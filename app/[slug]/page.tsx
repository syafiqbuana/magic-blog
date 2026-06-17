import { ArticleCard } from "@/components/article-card";
import {BlogSiteFooter} from "@/components/blog-site-footer";
import {BlogSiteHeader} from "@/components/blog-site-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const dummyArticles = [
  {
    id: 1,
    title: "The Architecture of Nothing: Building Minimalist Systems",
    excerpt: "In software design, true elegance is found not in what you add, but in what you can remove without collapsing the structure. Exploring the limits of reductionist architecture.",
    category: "ENGINEERING",
    date: "Oct 24, 2024",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAAArPS6r0V4DSR4sQiw7ossfVif8Mhak5FrZVK9KQePjy_vfy_1e2LnkTMseqHmCkb9bfJPL9J_AOlILz1Bqa0CKVFbvfVNB6dBW4z-Phm0RmP0bjEZHOPS_RS2203hl6p0_XPOHJJu3wQoTc9w-5rjrdA-ZiMS7HDQVSQhCWJ3VpqolpKOQMlgGN1AGZprkfvkiJEku741Rr9yBgtVvWxrwyPsLIwkKgdML2IYN0ZYwztykPAjttJ5ThTCR7n96ojv0QPiUiFLZQ",
    slug: "architecture-of-nothing"
  },
  {
    id: 2,
    title: "Why 'Clean Code' is Often a Trap",
    excerpt: "The pursuit of theoretical perfection often leads to fragile, over-abstracted systems. A case for pragmatic, 'dirty' but robust engineering over dogmatic cleanliness.",
    category: "OPINION",
    date: "Sep 30, 2024",
    imageUrl: "", // Kosong akan memicu tampilan khusus
    slug: "clean-code-trap"
  }
];

export default function BlogHomepage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-mono">
      <BlogSiteHeader />
      
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Articles</h1>
          <p className="text-muted-foreground">Thoughts on software engineering, brutalist design, and the mechanics of minimal systems.</p>
        </div>

        {/* Vertical Feed of Blog Posts */}
        <div className="flex flex-col gap-12">
          {dummyArticles.map((article, index) => (
            <div key={article.id} className="flex flex-col gap-12">
              <ArticleCard {...article} />
              {/* Tambahkan separator kecuali untuk item terakhir */}
              {index !== dummyArticles.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        {/* Pagination / Load More */}
        <div className="mt-12 flex justify-center border-t border-border pt-8">
          <Button variant="outline" className="w-full uppercase font-bold tracking-widest h-12">
            Load More Archive
          </Button>
        </div>
      </main>

      <BlogSiteFooter />
    </div>
  );
}