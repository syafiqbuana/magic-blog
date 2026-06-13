'use server'

import { LoginForm } from "@/components/login-form"
// app/universal/login/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
// Import komponen form (Client Component) milikmu di sini jika dipisah
// import { LoginForm } from "@/components/login-form";

export default async function Page() {

  const requestHeaders = await headers();

  const session = await auth.api.getSession({
      headers: requestHeaders,
  });

  if (session?.user) {
    const isSuperadmin = session.user.isSuperadmin;
    if (isSuperadmin) {
      return redirect(`/superadmin`);
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
        <LoginForm />
      </div>
    </div>
  )
}
