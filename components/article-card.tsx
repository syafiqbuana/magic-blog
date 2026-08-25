import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl?: string;
  slug: string;
}

export function ArticleCard({ title, excerpt, category, date, imageUrl, slug }: ArticleCardProps) {
  // Jika tidak ada gambar (Varian Opinion)
  if (!imageUrl) {
    return (
      <Link href={`/blog/${slug}`} className="group block">
        <article className="flex flex-col gap-4 p-4 border border-border bg-muted/20 hover:bg-muted/50 transition-colors">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Badge className="rounded-sm font-mono">{category}</Badge>
              <span className="text-sm text-muted-foreground font-mono">{date}</span>
            </div>
            <h2 className="text-2xl font-bold">
              {title}
            </h2>
            <p className="text-muted-foreground line-clamp-3">
              {excerpt}
            </p>
            <div className="mt-2 flex items-center gap-1 text-sm font-bold">
              Read more <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Jika ada gambar (Varian Standar)
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="flex flex-col gap-4 cursor-pointer">
        <div className="w-full aspect-[16/9] relative bg-muted border border-border overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={title}
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 border border-black/10 mix-blend-overlay pointer-events-none"></div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="rounded-sm font-mono">{category}</Badge>
            <span className="text-sm text-muted-foreground font-mono">{date}</span>
          </div>
          <h2 className="text-2xl font-bold">
            {title}
          </h2>
          <p className="text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
          <div className="mt-2 flex items-center gap-1 text-sm font-bold">
            Read more <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </article>
    </Link>
  );
}