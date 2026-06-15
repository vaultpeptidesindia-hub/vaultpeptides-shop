export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/navbar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddressManager, type AddressRow } from "@/components/dashboard/address-manager";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const rows = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  const addresses: AddressRow[] = rows.map((a) => ({
    id: a.id,
    name: a.name,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    country: a.country,
    isDefault: a.isDefault,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-12 max-w-3xl">
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }), "mb-6 -ml-2 text-muted-foreground hover:text-foreground")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Addresses</h1>
        <p className="text-muted-foreground mb-8">Add, update, and choose your default shipping address.</p>
        <AddressManager addresses={addresses} />
      </main>
    </div>
  );
}
