import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { NavbarClient } from "@/components/layout/navbar-client";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="h-20 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Vault Peptides" width={40} height={40} className="object-contain" />
          <span className="text-xl font-bold tracking-tighter">VAULT PEPTIDES</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
          <Link href="/wholesale" className="text-sm font-medium hover:text-primary transition-colors">Wholesale</Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
        </div>

        <NavbarClient
          isLoggedIn={!!session}
          isAdmin={session?.user?.role === "ADMIN"}
          userName={session?.user?.name ?? null}
        />

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={20} />
        </Button>
      </div>
    </nav>
  );
}
