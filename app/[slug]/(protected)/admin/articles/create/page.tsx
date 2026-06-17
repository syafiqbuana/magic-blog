//app/[slug]/(protected)/admin/articles/create/page.tsx

import ArticleForm from "@/components/ArticlesForm";

export default function Page() {
    return (
        <div>
            <h1 className="text-2xl font-bold">Create Article</h1>
            <ArticleForm />
        </div>
    )
}