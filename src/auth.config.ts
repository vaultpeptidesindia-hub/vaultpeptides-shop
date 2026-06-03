import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [], // Providers are loaded in auth.ts to avoid Edge Runtime size limits
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // This only runs when the user first signs in, meaning 'user' is the object returned by authorize()
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
