"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

// --- SUB-KOMPONEN UNTUK TOMBOL HAPUS ---
// Dipisah agar state loading & dialog tidak bentrok antar baris artikel
function DeleteAction({
  articleId,
  onDeleteSuccess,
}: {
  articleId: string;
  onDeleteSuccess: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Menahan dialog agar tidak langsung tertutup
    setIsDeleting(true);

    try {
const response = await fetch(`/api/admin/articles/${articleId}`, {
  method: "DELETE",
});

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete article");
      }

      // Beritahu tabel utama untuk menghapus artikel ini dari state lokal
      onDeleteSuccess(articleId);
      setIsOpen(false); // Tutup dialog setelah sukses
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Artikel ini beserta semua foto yang
            terkait di dalamnya akan dihapus secara permanen dari server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// --- KOMPONEN UTAMA ---
export function ArticlesTable({ slug }: { slug: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An error occurred while fetching articles"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fungsi untuk membuang artikel yang dihapus dari state lokal (UI langsung update)
  const removeArticleFromState = (deletedId: string) => {
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== deletedId)
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading articles...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">Error: {error}</div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <p className="text-gray-500 mb-4">No articles found. Create your first article to get started.</p>
        <Link href={`/${slug}/admin/articles/create`}>
          <Button>Create Article</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">{article.title}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {article.categories.length > 0 ? (
                    article.categories.map((category) => (
                      <Badge key={category.id} variant="outline">
                        {category.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No categories</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={article.isPublished ? "default" : "secondary"}>
                  {article.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(article.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/${slug}/admin/articles/edit/${article.id}`}>
                    <Button size="sm" variant="ghost">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>

                  {/* Menggunakan Sub-Komponen DeleteAction */}
                  <DeleteAction
                    articleId={article.id}
                    onDeleteSuccess={removeArticleFromState}
                  />
                  
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}