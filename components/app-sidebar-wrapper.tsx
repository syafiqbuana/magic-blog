// components/app-sidebar-wrapper.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";

export async function AppSidebarWrapper({
  slug,
  ...props
}: {
  slug?: string;
  [key: string]: any;
}) {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
      headers: requestHeaders,
  });

  const user = session?.user || null;

  return <AppSidebar user={user} slug={slug} {...props} />
}