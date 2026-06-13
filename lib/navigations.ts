// lib/navigations.ts
import { HouseIcon, UsersIcon,ArticleIcon,DotsSixVerticalIcon } from '@phosphor-icons/react'

// Navigasi khusus Superadmin
export const superadminNav = [
  {
    title: "Dashboard",
    url: "/superadmin/dashboard",
    icon: HouseIcon,
  },
  {
    title: "Manajemen Tenant",
    url: "/superadmin/tenants",
    icon: UsersIcon,
  },
];

// Navigasi untuk Admin biasa (butuh slug dinamis)
export const getAdminNav = (slug: string) => [
  {
    title: "Dashboard",
    url: `/${slug}/admin/dashboard`,
    icon: HouseIcon,
  },
  {
    title: "Articles",
    url: `/${slug}/admin/articles`,
    icon: ArticleIcon,
  },
  {
    title: "Categories",
    url: `/${slug}/admin/categories`,
    icon: DotsSixVerticalIcon,
  },
];