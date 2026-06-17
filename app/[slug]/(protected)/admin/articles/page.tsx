import { ArticlesTable } from "@/components/ArticlesTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link href={`/${slug}/admin/articles/create`}>
          <Button>Create Article</Button>
        </Link>
      </div>
      <ArticlesTable slug={slug} />
    </div>
  );
}