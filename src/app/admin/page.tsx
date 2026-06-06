export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, IndianRupee, FileText, Building2 } from "lucide-react";

export default async function AdminPage() {
  const [orderCount, revenue, userCount, coaCount, wholesaleCount] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { totalAmount: true } }),
    db.user.count(),
    db.cOARequest.count(),
    db.wholesaleInquiry.count(),
  ]);

  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const stats = [
    { label: "Total Revenue", value: `₹${(revenue._sum.totalAmount ?? 0).toFixed(2)}`, icon: IndianRupee },
    { label: "Orders", value: orderCount, icon: ShoppingBag },
    { label: "Customers", value: userCount, icon: Users },
    { label: "COA Requests", value: coaCount, icon: FileText },
    { label: "Wholesale Leads", value: wholesaleCount, icon: Building2 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div>
                  <div className="font-mono font-medium text-sm">{order.orderNumber}</div>
                  <div className="text-xs text-muted-foreground">{order.user?.name ?? "Guest"}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">₹{order.totalAmount.toFixed(2)}</div>
                  <div className="text-xs text-primary uppercase font-bold">{order.status}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
