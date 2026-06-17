// components/admin/ArticleForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichEditor from "@/components/ui/rich-editor";
import { MultiSelect, OptionType } from "@/components/ui/multi-select";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import { Button } from "./ui/button";

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Tambahkan interface untuk props
interface ArticleFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    images: string;
    isPublished: boolean;
    categoryIds: string[];
  } | null;
}

export default function ArticleForm({ initialData }: ArticleFormProps) {
  // Inisialisasi state dengan initialData jika ada
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categoryIds || []
  );
  const [imageUrl, setImageUrl] = useState<string>(initialData?.images || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false);
  
  const params = useParams(); 
  const slug = generateSlug(title);
  const currentSlug = params.slug;
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(
            data.map((cat: any) => ({
              label: cat.name,
              value: cat.id,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanContent = content.replace(/<[^>]*>?/gm, '').trim();

    if (!title || !slug || selectedCategories.length === 0 || !imageUrl || !cleanContent) {
      toast.error("Validation Error", {
        description: "All fields (Title, Slug, Categories, Cover Image, and Content) are required!",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Tentukan endpoint dan method berdasarkan mode (Edit atau Create)
      const url = initialData 
        ? `/api/admin/articles/${initialData.id}` 
        : "/api/admin/articles";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          categoryIds: selectedCategories,
          images: imageUrl ? [imageUrl] : null,
          isPublished
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${initialData ? 'update' : 'create'} article`);
      }

      toast.success("Success!", {
        description: `Your article has been successfully ${initialData ? 'updated' : 'published'}.`,
      });
      
      router.push(`/${currentSlug}/admin/articles`);
      router.refresh();
      
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to Save", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6 max-w-4xl relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="font-medium text-sm">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-input bg-background px-3 py-2 rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="slug" className="font-medium text-sm">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            disabled
            className="border border-input bg-background px-3 py-2 rounded-md shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-sm">
            Categories <span className="text-red-500">*</span>
          </label>
          <MultiSelect
            options={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Select categories..."
          />
        </div>

        <div className="flex items-center space-x-2 bg-secondary/20 p-2 rounded-md ">
          <input
            id="isPublished"
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 rounded border-input text-primary focus:ring-primary focus:ring-2"
          />
          <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer select-none">
            Publish
          </label>
          <p className="text-xs text-muted-foreground ml-2">
            (Check this to make the article publicly visible)
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-sm">
          Cover Image <span className="text-red-500">*</span>
        </label>
        <ImageUpload value={imageUrl} onChange={setImageUrl} />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-sm">
          Content <span className="text-red-500">*</span>
        </label>
        <RichEditor value={content} onChange={setContent} />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : (initialData ? "Update Article" : "Save Article")}
      </Button>
    </form>
  );
}