import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []),

    // Email + Password
    Credentials({
      id: "credentials",
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),

    // Phone OTP (verified in the action before calling signIn)
    Credentials({
      id: "phone-otp",
      async authorize(credentials) {
        const parsed = z.object({ userId: z.string() }).safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({ where: { id: parsed.data.userId } });
        if (!user) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});
