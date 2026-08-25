// components/stat-overview.tsx
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { getDashboardStat } from "@/lib/dashboard";

export default async function StatOverview({ slug }: { slug?: string }) {
  // Lempar slug ke dalam fungsi fetcher
  const stats = await getDashboardStat(slug);

  return (
    <div className="flex flex-row m-2 py-4 md:gap-6 md:py-6">
      {/* Ubah pengecekan dari 'role' menjadi 'viewType' (ditentukan dari server) */}
      {stats.viewType === "superadmin" ? (
        <>
          <Card className="w-[200px]">
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.totalUsers}</span>
            </CardContent>
          </Card>

          <Card className="w-[200px]">
            <CardHeader>
              <CardTitle>Global Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.globalArticles}</span>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card className="w-[200px]">
            <CardHeader>
              <CardTitle>Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.totalArticles}</span>
            </CardContent>
          </Card>
          <Card className="w-[200px]">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.totalCategories}</span>
            </CardContent>
          </Card>
          <Card className="w-[200px]">
            <CardHeader>
              <CardTitle>Draft Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.draftArticles}</span>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}