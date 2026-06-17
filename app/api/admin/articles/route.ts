import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Skema validasi menggunakan Zod untuk artikel
const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().optional(),
  isPublished: z.boolean().optional().default(false),
  images: z.any().optional(),
  categoryIds: z.array(z.string()).optional(),
  userId: z.string().optional(), // Tambahan untuk menangkap ID target dari superadmin
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whereClause = user.isSuperadmin ? {} : { userId: user.id };

    const articles = await prisma.article.findMany({
      where: whereClause,
      include: { categories: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validasi data request
    const { title, slug, content, isPublished, images, categoryIds, userId: targetUserId } = createArticleSchema.parse(body);

    // Default pemilik artikel adalah user yang sedang login
    let articleOwnerId = user.id;

    // Logika khusus Superadmin
    if (user.isSuperadmin) {
      // Jika superadmin membuat artikel, mereka WAJIB menyertakan ID user biasa
      if (!targetUserId) {
        return NextResponse.json(
          { error: "Superadmin must provide the target user's ID to assign ownership." }, 
          { status: 400 }
        );
      }
      // Timpa articleOwnerId dengan ID user biasa
      articleOwnerId = targetUserId;
    }

    // Menyiapkan koneksi many-to-many ke categories (jika ada)
    const categoryConnections = categoryIds && categoryIds.length > 0
      ? { connect: categoryIds.map((id) => ({ id })) }
      : undefined;

    // Membuat artikel baru
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        isPublished: isPublished ?? false,
        images: images || null,
        userId: articleOwnerId, // Data akan masuk sebagai milik user biasa
        ...(categoryConnections && { categories: categoryConnections }),
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 409 }
      );
    }

    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}