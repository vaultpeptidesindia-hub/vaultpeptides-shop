export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminWholesalePage() {
  const leads = await db.wholesaleInquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Wholesale Leads</h2>
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>Monthly Volume</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.companyName}</TableCell>
                <TableCell>{l.contactName}</TableCell>
                <TableCell>{l.phone}</TableCell>
                <TableCell>{l.email}</TableCell>
                <TableCell>{l.businessType}</TableCell>
                <TableCell>{l.monthlyVolume}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={l.status === "NEW" ? "border-blue-500 text-blue-500" : "border-green-500 text-green-500"}>
                    {l.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(l.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No wholesale inquiries yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
