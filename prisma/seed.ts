// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding database...');

  // 1. Data Superadmin
  const superadminId = 'superadmin-id-001';
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@domain.com' },
    update: {}, // Biarkan kosong jika tidak ingin menimpa data yang sudah ada
    create: {
      id: superadminId,
      name: 'Super Admin',
      email: 'superadmin@domain.com',
      emailVerified: true,
      slug: 'superadmin',       // <-- Superadmin tetap diberikan slug
      isSuperadmin: true,       // <-- Jadikan Superadmin
      accounts: {
        create: {
          id: 'acc-superadmin-001',
          accountId: 'superadmin@domain.com',
          providerId: 'credential',
          userId: superadminId,
          // ⚠️ PERHATIAN SOAL PASSWORD:
          // Better Auth melakukan hash password menggunakan algoritma 'scrypt'.
          // Memasukkan teks biasa seperti "password123" tidak akan bisa digunakan untuk login.
          // Kamu butuh memasukkan hash yang valid di sini.
          password: 'superadmin',
        },
      },
    },
  });

  console.log(`✅ Superadmin berhasil dibuat: ${superadmin.email}`);

  // 2. Data User Biasa
  const regularUserId = 'user-id-001';
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@domain.com' },
    update: {},
    create: {
      id: regularUserId,
      name: 'Budi Santoso',
      email: 'user@domain.com',
      emailVerified: true,
      slug: 'budi-santoso',    // <-- Slug URL profil untuk user
      isSuperadmin: false,     // <-- User biasa
      accounts: {
        create: {
          id: 'acc-user-001',
          accountId: 'user@domain.com',
          providerId: 'credential',
          userId: regularUserId,
          password: 'password',
        },
      },
    },
  });

  console.log(`✅ User biasa berhasil dibuat: ${regularUser.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });