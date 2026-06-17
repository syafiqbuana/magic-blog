// app/api/articles/[id]/route.ts
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

function getPublicIdFromUrl(url: string): string | null {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    let publicIdParts = parts.slice(uploadIndex + 1);
    if (publicIdParts[0].match(/^v\d+$/)) {
      publicIdParts = publicIdParts.slice(1);
    }

    const publicIdWithExtension = publicIdParts.join("/");
    const lastDotIndex = publicIdWithExtension.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return publicIdWithExtension.substring(0, lastDotIndex);
    }
    return publicIdWithExtension;
  } catch (error) {
    console.error("Failed to extract Cloudinary Public ID:", error);
    return null;
  }
}

async function destroyCloudinaryAsset(publicId: string) {
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) {
    console.error("Cloudinary env vars tidak lengkap");
    return { error: "missing_env" };
  }

  const timestamp = Math.round(Date.now() / 1000);

  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  return await res.json();
}

async function deleteImagesFromCloudinary(imagesInput: any) {
  if (!imagesInput) return;

  let urls: string[] = [];
  if (typeof imagesInput === "string") {
    try {
      const parsed = JSON.parse(imagesInput);
      urls = Array.isArray(parsed) ? parsed : [imagesInput];
    } catch (e) {
      urls = [imagesInput];
    }
  } else if (Array.isArray(imagesInput)) {
    urls = imagesInput;
  }

  for (const url of urls) {
    if (typeof url === "string") {
      const publicId = getPublicIdFromUrl(url);
      if (publicId) {
        try {
          const result = await destroyCloudinaryAsset(publicId);
          if (result?.result !== "ok" && result?.result !== "not found") {
            console.error(`Cloudinary gagal hapus ${publicId}:`, result);
          }
        } catch (error) {
          console.error(`[ERROR] Failed to delete ${publicId}:`, error);
        }
      }
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (!user.isSuperadmin && existingArticle.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (existingArticle.images) {
      await deleteImagesFromCloudinary(existingArticle.images);
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Article and associated media deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Cek Autentikasi
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, categoryIds, images, isPublished } = body;

    // 2. Cari artikel yang ada untuk verifikasi kepemilikan dan membandingkan gambar lama
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // 3. Cek Otorisasi (Hanya pemilik atau superadmin)
    if (!user.isSuperadmin && existingArticle.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. (Opsional) Hapus gambar lama dari Cloudinary jika gambar diubah
    // Kita cek apakah gambar lama ada, dan nilainya berbeda dengan gambar yang baru dikirim
    const oldImagesString = JSON.stringify(existingArticle.images);
    const newImagesString = JSON.stringify(images);

    if (existingArticle.images && oldImagesString !== newImagesString) {
      // Panggil fungsi yang sudah kamu buat sebelumnya untuk menghapus asset
      await deleteImagesFromCloudinary(existingArticle.images);
    }

    // 5. Update Artikel dan Relasi Kategori
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        isPublished,
        images, // Karena tipenya Json? di Prisma, kita bisa langsung pass array/string
        // Menggunakan `set` untuk me-replace semua kategori lama dengan yang baru
        categories: {
          set: categoryIds?.map((categoryId: string) => ({ id: categoryId })) || [],
        },
      },
    });

    return NextResponse.json({
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error: any) {
    console.error("Error updating article:", error);
    
    // Handle error jika slug duplikat untuk user yang sama
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
       return NextResponse.json(
        { error: "Slug already exists. Please choose a different title." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 },
    );
  }
}