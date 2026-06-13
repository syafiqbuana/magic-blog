

import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarWrapper } from "@/components/app-sidebar-wrapper"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default async function AdminLayout({ 
  children,
  params,
}: { 
  children: React.ReactNode;
  params: Promise<{ slug: string }> | { slug: string }; // Mendukung Next.js 14 & 15
}) {
  // Ambil slug dari parameter URL
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const session = await auth.api.getSession(
    {
      headers: await headers(),
    }
  );

  if (!session?.user) {
    redirect(`/${slug}/login`);
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        
        {/* Kirimkan slug ke Wrapper agar navigasi tahu ini ruang kerja siapa */}
        <AppSidebarWrapper slug={slug} />
        
        <main className="w-full flex-1">
          <div className="p-4">
            <SidebarTrigger />
          </div>
          
          <div className="p-4 pt-0">
            {children}
          </div>
        </main>

      </SidebarProvider>
    </TooltipProvider>
  )
}