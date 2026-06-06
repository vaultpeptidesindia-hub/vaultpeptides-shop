"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBatch } from "@/actions/batches";
import { toast } from "sonner";

interface Product { id: string; name: string }

export function CreateBatchForm({ products }: { products: Product[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedProducts.length === 0) { toast.error("Select at least one product."); return; }
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await createBatch({
      batchNumber: fd.get("batchNumber") as string,
      productIds: selectedProducts,
      testedAt: fd.get("testedAt") as string || undefined,
      expiresAt: fd.get("expiresAt") as string || undefined,
      coaUrl: fd.get("coaUrl") as string || undefined,
      notes: fd.get("notes") as string || undefined,
    });
    setLoading(false);
    if (res.success) {
      toast.success("Batch created!");
      setSelectedProducts([]);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Batch Number *</Label>
        <Input name="batchNumber" required placeholder="VP-BATCH-001" className="bg-background" />
      </div>
      <div className="space-y-2">
        <Label>Assign to Products *</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
          {products.map((p) => (
            <label key={p.id} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={selectedProducts.includes(p.id)}
                onChange={() => toggle(p.id)}
                className="accent-primary"
              />
              {p.name}
            </label>
          ))}
          {products.length === 0 && <p className="text-xs text-muted-foreground">No products found.</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Tested At</Label>
          <Input name="testedAt" type="date" className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label>Expires At</Label>
          <Input name="expiresAt" type="date" className="bg-background" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>COA URL</Label>
        <Input name="coaUrl" type="url" placeholder="https://…" className="bg-background" />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        {loading ? "Creating…" : "Create Batch"}
      </Button>
    </form>
  );
}
