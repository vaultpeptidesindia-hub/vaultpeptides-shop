"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createReferralCode, setReferralActive, deleteReferralCode } from "@/actions/referral";
import { discountLabel } from "@/lib/discount";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface ReferralRow {
  id: string;
  code: string;
  affiliateName: string;
  affiliatePhone: string;
  discountType: string;
  discountValue: number;
  active: boolean;
  timesUsed: number;
}

export function ReferralManager({ codes }: { codes: ReferralRow[] }) {
  const [loading, setLoading] = useState(false);
  const [discountType, setDiscountType] = useState<"NONE" | "PERCENT" | "FLAT">("NONE");
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    const res = await createReferralCode({
      code: fd.get("code") as string,
      affiliateName: fd.get("affiliateName") as string,
      affiliatePhone: fd.get("affiliatePhone") as string,
      discountType,
      discountValue: discountType === "NONE" ? 0 : Number(fd.get("discountValue") || 0),
    });
    setLoading(false);
    if (res.success) {
      toast.success(res.success);
      form.reset();
      setDiscountType("NONE");
    } else {
      toast.error(res.error);
    }
  };

  const toggleActive = (id: string, active: boolean) =>
    startTransition(async () => {
      const res = await setReferralActive(id, active);
      if (res.error) toast.error(res.error);
    });

  const remove = (id: string, code: string) => {
    if (!confirm(`Delete code ${code}? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await deleteReferralCode(id);
      if (res.success) toast.success(res.success);
      else toast.error(res.error);
    });
  };

  const selectCls =
    "h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Create form */}
      <div className="lg:col-span-1">
        <form onSubmit={handleCreate} className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-lg">Create Referral Code</h3>

          <div className="space-y-2">
            <Label>Code *</Label>
            <Input name="code" required placeholder="RIYA10" className="bg-background uppercase tracking-wider" />
          </div>
          <div className="space-y-2">
            <Label>Affiliate Name *</Label>
            <Input name="affiliateName" required placeholder="Riya Sharma" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Affiliate WhatsApp Phone *</Label>
            <Input name="affiliatePhone" required placeholder="+91 98765 43210" className="bg-background" />
            <p className="text-xs text-muted-foreground">Gets a WhatsApp message each time this code is used.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <select
                name="discountType"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "NONE" | "PERCENT" | "FLAT")}
                className={selectCls}
              >
                <option value="NONE">None (track only)</option>
                <option value="PERCENT">% off</option>
                <option value="FLAT">₹ off</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                name="discountValue"
                type="number"
                min={0}
                step="any"
                disabled={discountType === "NONE"}
                placeholder={discountType === "PERCENT" ? "10" : discountType === "FLAT" ? "500" : "—"}
                className="bg-background disabled:opacity-50"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? "Creating…" : "Create Code"}
          </Button>
        </form>
      </div>

      {/* List */}
      <div className="lg:col-span-2">
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Affiliate</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="text-center">Used</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((c) => (
                <TableRow key={c.id} className={c.active ? "" : "opacity-50"}>
                  <TableCell className="font-mono font-semibold">{c.code}</TableCell>
                  <TableCell className="text-sm">
                    <div>{c.affiliateName}</div>
                    <div className="text-xs text-muted-foreground">{c.affiliatePhone}</div>
                  </TableCell>
                  <TableCell className="text-sm">{discountLabel(c.discountType, c.discountValue)}</TableCell>
                  <TableCell className="text-center font-medium">{c.timesUsed}</TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => toggleActive(c.id, !c.active)}
                      disabled={isPending}
                      className={`text-xs font-medium px-2 py-1 rounded-full ${c.active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}
                    >
                      {c.active ? "Active" : "Off"}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => remove(c.id, c.code)}
                      disabled={isPending}
                      className="text-muted-foreground hover:text-red-600 transition-colors"
                      aria-label="Delete code"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {codes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No referral codes yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
