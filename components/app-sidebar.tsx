"use client"

import * as React from "react"
import Link from "next/link"
import { NavUser } from "@/components/nav-user"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CommandIcon } from "@phosphor-icons/react"
import { getAdminNav, superadminNav } from "@/lib/navigations"

export function AppSidebar({
  user,
  slug,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
  slug?: string
}) {
  const isAdminPath = Boolean(slug)
  const navigationItems = isAdminPath && slug ? getAdminNav(slug) : superadminNav

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href={isAdminPath && slug ? `/${slug}/admin` : "/superadmin/dashboard"}>
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Restricted Area</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name || "Guest",
          email: user?.email || "no-email",
          avatar: user?.image || "/avatars/default.jpg"
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}

