import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, FlaskConical, Truck, Award, Package } from "lucide-react";
import { ProductActions } from "@/components/shop/product-actions";
import { ProductCard } from "@/components/shop/product-card";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: `${product.name} | Vault Peptides`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Vault Peptides`,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { orderBy: { price: "asc" } },
      batches: { include: { batch: true }, take: 1, orderBy: { assignedAt: "desc" } },
    },
  });

  if (!product) notFound();

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, status: "ACTIVE", NOT: { id: product.id } },
    take: 3,
    include: { category: true, variants: { orderBy: { price: "asc" } } },
  });

  const currentBatch = product.batches[0]?.batch ?? null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Product hero */}
        <section className="py-16 container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <div className="relative aspect-square bg-card border border-border rounded-lg overflow-hidden">
              <Image
                src={product.images[0] || "/logo.png"}
                alt={product.name}
                fill
                className="object-contain p-10"
                priority
              />
              {currentBatch && (
                <div className="absolute bottom-4 left-4 bg-background/90 border border-border rounded px-3 py-2">
                  <p className="font-sans text-[9px] text-muted-foreground uppercase tracking-widest">Batch No.</p>
                  <p className="font-mono text-xs font-bold text-foreground">{currentBatch.batchNumber}</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="font-sans text-[10px] tracking-[0.25em] text-primary/70 uppercase mb-3">
                {product.category.name}
              </p>
              <h1 className="font-serif text-4xl lg:text-5xl font-light text-foreground mb-6 leading-tight">
                {product.name}
              </h1>
              <p className="font-sans text-sm text-foreground/60 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Variant selector + cart */}
              <ProductActions
                product={{ id: product.id, name: product.name, slug: product.slug, image: product.images[0] || "/logo.png" }}
                variants={product.variants.map((v) => ({ id: v.id, name: v.name, price: v.price, stock: v.stock }))}
              />

              {/* Product details */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-8">
                {[
                  { label: "Purity", value: "≥ 99%" },
                  { label: "Storage", value: "2–8°C Recommended" },
                  { label: "Origin", value: "Research Grade" },
                  { label: "COA", value: "Available on Request" },
                ].map((detail) => (
                  <div key={detail.label}>
                    <p className="font-sans text-[9px] tracking-widest uppercase text-muted-foreground mb-1">{detail.label}</p>
                    <p className="font-sans text-sm font-medium text-foreground">{detail.value}</p>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { icon: ShieldCheck, text: "99%+ Purity Certified" },
                  { icon: Award, text: "COA Available" },
                  { icon: FlaskConical, text: "Research Grade" },
                  { icon: Truck, text: "Fast Pan-India Shipping" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-xs font-sans text-foreground/60">
                    <b.icon className="h-4 w-4 text-primary shrink-0" />
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="py-16 bg-card/40 border-t border-border">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center gap-3 mb-10">
                <Package className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-2xl font-light">Related Products</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
