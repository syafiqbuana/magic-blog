"use client";

import { CategoriesTable } from "@/components/CategoriesTable";
import { CategoryDialog } from "@/components/CategoryDialog";

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <CategoryDialog onCategorySaved={() => {}} />
      </div>
      <CategoriesTable />
    </div>
  );
}