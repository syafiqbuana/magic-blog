import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import {getDashboardStat} from "@/lib/dashboard";
import StatOverview from "@/components/stat-overview";



export  default async function Page() {



  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <SiteHeader />
          <StatOverview />
        </div>
      </div>
    </SidebarInset>
  );
}
