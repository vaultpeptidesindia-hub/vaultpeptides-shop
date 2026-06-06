import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, FileText, Building2, Hash, ArrowLeft } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coa", label: "COA Requests", icon: FileText },
  { href: "/admin/wholesale", label: "Wholesale Leads", icon: Building2 },
  { href: "/admin/batches", label: "Batch Tracking", icon: Hash },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary tracking-tight">Vault Admin</h2>
          <p className="text-xs text-muted-foreground mt-1">vaultpeptides.shop</p>
        </div>
        <nav className="px-4 py-4 space-y-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center px-8 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
