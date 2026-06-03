import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary tracking-tight">Vault Admin</h2>
        </div>
        <nav className="px-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Package size={20} />
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ShoppingCart size={20} />
            Orders
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Users size={20} />
            Customers
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Settings size={20} />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center px-8 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
