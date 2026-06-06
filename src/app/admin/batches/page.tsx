export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBatchForm } from "@/components/admin/create-batch-form";

export default async function AdminBatchesPage() {
  const batches = await db.batchNumber.findMany({
    orderBy: { createdAt: "desc" },
    include: { products: { include: { product: { select: { name: true } } } } },
  });

  const products = await db.product.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight">Batch Tracking</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Create Batch</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateBatchForm products={products} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Tested At</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>COA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono font-medium">{b.batchNumber}</TableCell>
                    <TableCell className="text-sm">
                      {b.products.map((p) => p.product.name).join(", ") || "—"}
                    </TableCell>
                    <TableCell>{b.testedAt ? new Date(b.testedAt).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>{b.expiresAt ? new Date(b.expiresAt).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>
                      {b.coaUrl ? (
                        <a href={b.coaUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm underline">View</a>
                      ) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {batches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No batches created yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
