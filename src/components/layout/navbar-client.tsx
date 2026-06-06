"use client";

import Link from "next/link";
import { ShoppingCart, Search, User, LayoutDashboard, ShoppingBag, LogOut, Settings } from "lucide-react";
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

interface NavbarClientProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userName: string | null;
}

export function NavbarClient({ isLoggedIn, isAdmin, userName }: NavbarClientProps) {
  const totalItems = useCart((s) => s.totalItems());
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="hidden sm:flex">
        <Search size={20} />
      </Button>

      <Link href="/cart">
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </Button>
      </Link>

      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 gap-2">
              <User size={16} />
              <span className="hidden sm:inline">{userName?.split(" ")[0] ?? "Account"}</span>
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/orders")} className="cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" /> Orders
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer text-primary">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Panel
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="destructive"
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/login">
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
}
