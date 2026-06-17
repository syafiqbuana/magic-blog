"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryDialogProps {
  category?: Category;
  onCategorySaved: () => void;
  onCancel?: () => void;
}

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export function CategoryDialog({
  category,
  onCategorySaved,
  onCancel,
}: CategoryDialogProps) {
  const [open, setOpen] = useState(!!category);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
  });
  const [slugModified, setSlugModified] = useState(!!category);

  const isEditing = !!category;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({ ...formData, name: newName });

    if (!slugModified) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(newName),
      }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value;
    setFormData({ ...formData, slug: newSlug });
    setSlugModified(!!newSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      setLoading(true);
      const url = isEditing
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save category");
      }

      toast.success(
        isEditing ? "Category updated successfully" : "Category created successfully"
      );
      setOpen(false);
      setFormData({ name: "", slug: "" });
      setSlugModified(false);
      onCategorySaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onCancel) {
      onCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button>Create Category</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "Create Category"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category details"
              : "Add a new category to organize your articles"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g., Technology"
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="e.g., technology"
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-generated from name, but you can customize it
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                if (onCancel) onCancel();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
