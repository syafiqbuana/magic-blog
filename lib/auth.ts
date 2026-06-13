// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
  },
  experimental: { joins: true },
  user: {
    additionalFields: {
      isSuperadmin: {
        type: "boolean",
        required: false, // Tidak wajib diisi (karena punya nilai default)
        defaultValue: false,
      },
    },
  },
  // --------------------------
});