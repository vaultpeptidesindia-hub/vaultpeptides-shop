import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Check for a real session user — not just a truthy req.auth — so that any
  // Auth.js error object never gets mistaken for an authenticated session.
  const isLoggedIn = !!req.auth?.user;
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute =
    ["/", "/shop", "/cart", "/checkout", "/wholesale", "/contact", "/why-vault", "/purity", "/research", "/verify-batch", "/faq"].includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/product/") ||
    nextUrl.pathname.startsWith("/research/") ||
    nextUrl.pathname.startsWith("/api/batch/");
  const isAuthRoute = ["/login", "/signup", "/forgot-password"].includes(nextUrl.pathname);

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isAdminRoute && req.auth?.user?.role !== "ADMIN") {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
