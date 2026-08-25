import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import StatOverview from "@/components/stat-overview";

// 1. Definisikan tipe Props, params bisa berupa Promise (Next 15) atau Object biasa (Next 14)
type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

// 2. Ubah Page menjadi 'async function'
export default async function Page({ params }: PageProps) {
  
  // 3. Wajib di-await agar nilai slug keluar dari Promise-nya
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <SiteHeader />
          <div className="flex flex-row m-2 py-4 md:gap-6 md:py-6">
            
            {/* 4. Masukkan variabel slug yang sudah di-resolve */}
            <StatOverview slug={slug} />
            
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}