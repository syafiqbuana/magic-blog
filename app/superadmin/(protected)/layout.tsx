// app/superadmin/layout.tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // Sesuaikan dengan lokasi konfigurasi Better Auth kamu

export default async function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Ambil sesi dari sisi server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Jika tidak ada sesi sama sekali (belum login), kembalikan ke form login
  if (!session?.user) {
    redirect("/superadmin/login"); 
  }

  // 3. VALIDASI UTAMA: Jika login tapi BUKAN superadmin, tendang!
  if (!session.user.isSuperadmin) {
    // Kamu bisa melemparnya ke halaman universal, halaman login mereka, atau halaman 403 Forbidden
    redirect("/universal/login"); 
  }

  // 4. Jika lolos validasi, render halaman superadmin
  return (
    <div className="superadmin-wrapper">
      {/* Kamu bisa meletakkan Sidebar, Header, atau Navigasi khusus 
        Superadmin di sini agar terpisah dari UI user biasa 
      */}
      {children}
    </div>
  );
}