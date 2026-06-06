"use client";

import Link from "next/link";
import { ShoppingCart, User, LayoutDashboard, ShoppingBag, LogOut, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/store/use-cart";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarClientProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userName: string | null;
}

const MOBILE_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/why-vault", label: "Why Us" },
  { href: "/purity", label: "Purity" },
  { href: "/research", label: "Research" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/contact", label: "Contact" },
];

export function NavbarClient({ isLoggedIn, isAdmin, userName }: NavbarClientProps) {
  const totalItems = useCart((s) => s.totalItems());
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1">
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary hover:bg-primary/10">
            <ShoppingCart size={19} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Button>
        </Link>

        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/10">
                <User size={19} />
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-48 bg-card border-border">
              <DropdownMenuLabel className="text-xs text-muted-foreground">{userName ?? "Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer text-sm">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/orders")} className="cursor-pointer text-sm">
                <ShoppingBag className="mr-2 h-4 w-4" /> Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer text-sm">
                <Settings className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer text-sm text-primary">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Panel
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} variant="destructive" className="cursor-pointer text-sm">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs tracking-widest font-medium text-foreground/70 hover:text-primary hover:bg-primary/10">
              LOGIN
            </Button>
          </Link>
        )}

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-foreground hover:text-primary hover:bg-primary/10"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background border-t border-border lg:hidden">
          <nav className="flex flex-col p-6 gap-1">
            {MOBILE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium tracking-widest border-b border-border text-foreground/70 hover:text-primary transition-colors"
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
