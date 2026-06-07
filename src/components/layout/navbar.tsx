import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { getCart } from "@/actions/cart";
import { NavbarClient } from "@/components/layout/navbar-client";

export default async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  // For logged-in users, fetch the DB cart count so the badge is accurate
  let dbCartCount = 0;
  if (isLoggedIn) {
    const cart = await getCart();
    dbCartCount = cart?.items?.length ?? 0;
  }

  return (
    <nav className="h-20 border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Vault Peptides"
            width={805}
            height={310}
            className="h-14 w-auto object-contain"
            style={{ mixBlendMode: "multiply" }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7">
          {[
            { href: "/shop", label: "SHOP" },
            { href: "/why-vault", label: "WHY US" },
            { href: "/purity", label: "PURITY" },
            { href: "/research", label: "RESEARCH" },
            { href: "/wholesale", label: "WHOLESALE" },
            { href: "/contact", label: "CONTACT" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-sans font-medium tracking-[0.12em] text-foreground/70 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right — cart + account */}
        <NavbarClient
          isLoggedIn={isLoggedIn}
          isAdmin={session?.user?.role === "ADMIN"}
          userName={session?.user?.name ?? null}
          dbCartCount={dbCartCount}
        />
      </div>
    </nav>
  );
}
