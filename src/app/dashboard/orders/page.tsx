export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/navbar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "border-yellow-500 text-yellow-500",
  PROCESSING: "border-blue-500 text-blue-500",
  SHIPPED: "border-purple-500 text-purple-500",
  COMPLETED: "border-green-500 text-green-500",
  CANCELLED: "border-red-500 text-red-500",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-12">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="py-24 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 mb-4 opacity-20" />
            <p className="text-muted-foreground text-lg">No orders yet.</p>
            <Link href="/shop">
              <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const addr = order.shippingAddress as { name: string; city: string; state: string };
              return (
                <div key={order.id} className="border border-border rounded-2xl bg-card overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border">
                    <div>
                      <div className="font-mono font-bold text-lg">{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        {" · "}
                        {addr.city}, {addr.state}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={STATUS_COLORS[order.status] ?? ""}>
                        {order.status}
                      </Badge>
                      <span className="font-bold text-lg">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.variant.product.name}{" "}
                          <span className="text-primary font-medium">{item.variant.name}</span>{" "}
                          × {item.quantity}
                        </span>
                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
