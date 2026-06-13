// app/[slug]/login/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import prisma from "@/lib/prisma";

export default async function SlugLoginPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // Di Next.js 15+, params adalah Promise yang harus di-await
  const { slug } = await params;

  const requestHeaders = await headers();

  const session = await auth.api.getSession({
      headers: requestHeaders,
  });

  if (session?.user) {
    if (session.user.isSuperadmin) {
      if (slug === "superadmin") {
        return redirect(`/superadmin`);
      }
      return redirect(`/${slug}/admin`);
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      select: { slug: true }
    });

    if (userProfile?.slug) {
      return redirect(`/${userProfile.slug}/admin`);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* Menggunakan komponen LoginForm yang sama dengan universal */}
        <LoginForm />
      </div>
    </div>
  )
}