

import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarWrapper } from "@/components/app-sidebar-wrapper"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/sonner"
import { headers } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession(
    {
      headers: await headers(),
    }
  );

  if (!session?.user) {
    redirect(`/superadmin/login`);
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        
        {/* Ruang kerja superadmin: tanpa slug tenant */}
        <AppSidebarWrapper />
        
        <main className="w-full flex-1">
          <div className="p-4">
            <SidebarTrigger />
          </div>
          
          <div className="p-4 pt-0">
            {children}
            <Toaster position="top-right" richColors />
          </div>
        </main>

      </SidebarProvider>
    </TooltipProvider>
  )
}