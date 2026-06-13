// app/actions/auth.ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

// Fungsi pembantu untuk membuat slug dari nama (contoh: "Budi Santoso" -> "budi-santoso-123")
function generateSlug(name: string) {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
  const randomString = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randomString}`;
}

export async function getCurrentUser() {
  try {
    // Memanggil API getSession dari Better Auth di sisi server
    // Headers wajib dikirim agar Better Auth bisa membaca cookie session Next.js
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Mengembalikan data user jika sesi valid, atau null jika belum login
    return session?.user || null;
  } catch (error) {
    console.error("Gagal mengambil sesi user:", error);
    return null;
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  let portalSlug = formData.get("portalSlug") as string; // Ubah ke let agar bisa dimodifikasi

  let userSlug = "";
  let isSuperadmin = false;

  try {
    // 1. Verifikasi Kredensial via Better Auth
    const response = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    if (!response?.user) {
      return { error: "Kredensial tidak valid. Gagal login." };
    }

    // Ambil isSuperadmin langsung dari tabel user
    isSuperadmin = response.user.isSuperadmin || false;

    // 2. Pemisahan Logika Berdasarkan Peran
    if (isSuperadmin) {
      // --- LOGIKA SUPERADMIN ---
      // Jika superadmin login dari portal user biasa, pastikan slug-nya valid di database
      if (
        portalSlug &&
        portalSlug !== "superadmin" &&
        portalSlug !== "universal"
      ) {
        const validTenant = await prisma.userProfile.findFirst({
          where: { slug: portalSlug },
          select: { slug: true },
        });

        if (!validTenant) {
          // Jika slug tidak ditemukan (mungkin URL salah), amankan rute dengan mengembalikannya ke dashboard utama
          portalSlug = "superadmin";
        }
      }
    } else {
      // --- LOGIKA USER BIASA ---
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId: response.user.id },
        select: { slug: true },
      });

      if (!userProfile?.slug) {
        await auth.api.signOut({ headers: await headers() });
        return {
          error: "Profil ruang kerja (slug) belum diatur untuk akun ini.",
        };
      }

      userSlug = userProfile.slug;

      // Validasi Keamanan Portal (Mencegah Akses Silang)
      if (portalSlug === "superadmin") {
        await auth.api.signOut({ headers: await headers() });
        return {
          error:
            "You don't have permission to access the superadmin dashboard.",
        };
      }

      if (portalSlug !== "universal" && portalSlug !== userSlug) {
        await auth.api.signOut({ headers: await headers() });
        return { error: "Akses ditolak. Ini bukan portal ruang kerja Anda." };
      }
    }
  } catch (error: any) {
    return { error: error.message || "Terjadi kesalahan saat proses login." };
  }

  // --- 3. EKSEKUSI REDIRECT ---
  if (isSuperadmin) {
    if (
      portalSlug &&
      portalSlug !== "superadmin" &&
      portalSlug !== "universal"
    ) {
      // Bypass berhasil: arahkan superadmin ke admin panel milik user biasa
      redirect(`/${portalSlug}/admin/dashboard`);
    } else {
      redirect(`/superadmin/dashboard`);
    }
  } else if (userSlug) {
    redirect(`/${userSlug}/admin/dashboard`);
  } else {
    return { error: "Data rute pengguna tidak valid." };
  }
}

export async function signOutAction() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  const isSuperadmin = session?.user.isSuperadmin;

  let userSlug = "universal";
  if (session?.user && !isSuperadmin) {
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      select: { slug: true },
    });
    if (userProfile?.slug) {
      userSlug = userProfile.slug;
    }
  }

  // 3. Eksekusi fungsi logout dari Better Auth
  await auth.api.signOut({
    headers: requestHeaders,
  });

  if (isSuperadmin) {
    return redirect(`/superadmin/login`);
  }

  // 4. Arahkan user kembali ke halaman login mereka
  // PENTING: redirect() di Next.js melempar error, sehingga harus berada di luar try-catch
  redirect(`/${userSlug}/login`);
}

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validasi dasar
  if (!name || !email || !password) {
    return { error: "Semua kolom wajib diisi!" };
  }

  // Buat slug otomatis
  const slug = generateSlug(name);
  const isSuperadmin = false;

  try {
    // Memanggil API server Better Auth
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        isSuperadmin, // Mengirim custom field ke Better Auth
      },
      // Headers wajib dikirim agar Better Auth bisa mengatur cookie session Next.js
      headers: await headers(),
    });

    // Jika ingin, kita bisa mengecek response-nya di sini
    if (!response?.user) {
      return { error: "Gagal membuat akun." };
    }

    // Buat UserProfile menggunakan Prisma
    await prisma.userProfile.create({
      data: {
        userId: response.user.id,
        slug: slug,
        fullname: name,
      },
    });
  } catch (error: any) {
    // Menangkap error dari Better Auth atau Prisma
    return { error: error.message || "Terjadi kesalahan saat pendaftaran." };
  }

  // Jika berhasil, alihkan pengguna ke halaman dashboard/admin mereka
  redirect(`/${slug}/admin`);
}
