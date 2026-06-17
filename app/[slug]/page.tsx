// app/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function UserBlogHomepage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Cari profil user berdasarkan slug
  const profile = await prisma.userProfile.findUnique({
    where: { slug },
    include: {
      user: {
        include: {
          // Ambil hanya artikel yang sudah di-publish
          articles: {
            where: { isPublished: true },
            orderBy: { createdAt: 'desc' }, // Urutkan dari yang terbaru
          }
        }
      }
    }
  });

  // Jika slug user tidak ditemukan, tampilkan halaman 404
  if (!profile) {
    notFound();
  }

  const articles = profile.user.articles;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header Profil Blog */}
      <div className="mb-10 text-center">
        {profile.profilePhoto && (
          <Image 
            src={profile.profilePhoto} 
            alt={profile.fullname} 
            width={100} height={100} 
            className="rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-3xl font-bold">{profile.fullname}'s Blog</h1>
      </div>

      {/* Daftar Artikel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.length === 0 ? (
          <p className="text-muted-foreground">Belum ada artikel yang dipublikasikan.</p>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/${slug}/${article.slug}`} className="hover:underline">
                  {article.title}
                </Link>
              </h2>
              {/* Jika ingin menampilkan cuplikan teks (snippet) bisa ditaruh di sini */}
              <p className="text-sm text-gray-500">
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}