import Navbar from "@/components/layout/navbar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, MapPin, User, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: { take: 3, orderBy: { createdAt: "desc" } },
      addresses: { where: { isDefault: true }, take: 1 }
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Manage your orders, addresses, and account settings.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card border-border md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
              <Link href="/dashboard/orders" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {user?.orders.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <ShoppingBag className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>You haven&apos;t placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {user?.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-xl bg-background/50">
                      <div>
                        <div className="font-mono font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">₹{order.totalAmount.toFixed(2)}</div>
                        <div className="text-xs text-primary uppercase font-bold tracking-wider">{order.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <MapPin size={20} className="text-primary" /> Default Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.addresses[0] ? (
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground">{user.addresses[0].line1}</p>
                    <p className="text-muted-foreground">{user.addresses[0].city}, {user.addresses[0].state}</p>
                    <p className="text-muted-foreground">{user.addresses[0].pincode}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No default address set.</p>
                )}
                <Link href="/dashboard/addresses" className={cn(buttonVariants({ variant: "outline" }), "w-full mt-4 border-border")}>
                  Manage Addresses
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Settings size={20} className="text-primary" /> Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard/profile" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start hover:bg-primary/10 hover:text-primary")}>
                  <User className="mr-2 h-4 w-4" /> Profile Settings
                </Link>
                <Link href="/dashboard/orders" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start hover:bg-primary/10 hover:text-primary")}>
                  <ShoppingBag className="mr-2 h-4 w-4" /> Order History
                </Link>
                <form action="/api/auth/signout" method="POST">
                   <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" type="submit">
                    Logout
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
