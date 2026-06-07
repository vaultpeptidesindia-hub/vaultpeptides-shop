"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, XCircle } from "lucide-react";

interface BatchResult {
  batchNumber: string;
  products: { product: { name: string } }[];
  testedAt: string | null;
  expiresAt: string | null;
  coaUrl: string | null;
}

export default function VerifyBatchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<BatchResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    const res = await fetch(`/api/batch/${encodeURIComponent(query.trim())}`);
    if (res.ok) {
      setResult(await res.json());
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-24 dot-pattern border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-4">Transparency</p>
            <h1 className="font-serif text-5xl font-light mb-6">Verify Your <em>Batch</em></h1>
            <p className="font-sans text-sm text-foreground/60 mb-10">
              Enter the batch number printed on your vial to verify its authenticity, testing date, and COA status.
            </p>
            <div className="flex gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. VP-BATCH-001"
                className="bg-background border-border h-12 font-sans text-sm rounded-none"
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-none font-sans text-xs tracking-widest"
              >
                <Search className="h-4 w-4 mr-2" /> VERIFY
              </Button>
            </div>
          </div>
        </section>

        {(result || notFound) && (
          <section className="py-16 container mx-auto px-4 lg:px-8 max-w-2xl">
            {notFound ? (
              <div className="bg-card border border-border rounded-lg p-10 text-center">
                <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-medium mb-2">Batch Not Found</h2>
                <p className="font-sans text-sm text-muted-foreground">
                  We couldn&apos;t find batch <strong>{query}</strong>. Please check the number and try again, or contact us.
                </p>
              </div>
            ) : result ? (
              <div className="bg-card border border-border rounded-lg p-10">
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle2 className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h2 className="font-serif text-2xl font-medium">Batch Verified</h2>
                    <p className="font-sans text-sm text-muted-foreground">This is an authentic Vault Peptides batch.</p>
                  </div>
                </div>
                <div className="space-y-4 font-sans text-sm">
                  <Row label="Batch Number" value={result.batchNumber} mono />
                  <Row label="Product(s)" value={result.products.map(p => p.product.name).join(", ") || "—"} />
                  <Row label="Tested At" value={result.testedAt ? new Date(result.testedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"} />
                  <Row label="Expires At" value={result.expiresAt ? new Date(result.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"} />
                  <Row
                    label="COA"
                    value={result.coaUrl ? (
                      <a href={result.coaUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">Download PDF</a>
                    ) : "Available on request"}
                  />
                </div>
              </div>
            ) : null}
          </section>
        )}
      </main>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
      <span className="text-muted-foreground text-xs tracking-widest uppercase">{label}</span>
      <span className={`font-medium text-foreground ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
