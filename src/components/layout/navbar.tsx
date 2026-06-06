import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { NavbarClient } from "@/components/layout/navbar-client";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="h-16 border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Vault Peptides"
            width={805}
            height={310}
            className="h-11 w-auto object-contain"
            style={{ mixBlendMode: "multiply" }}
            priority
          />
        </Link>

        {/* Desktop nav links */}
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
              className="text-xs font-medium tracking-[0.12em] text-foreground/70 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side — cart + account */}
        <NavbarClient
          isLoggedIn={!!session}
          isAdmin={session?.user?.role === "ADMIN"}
          userName={session?.user?.name ?? null}
        />
      </div>
    </nav>
  );
}
