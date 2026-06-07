import Navbar from "@/components/layout/navbar";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { ProductClientSection } from "@/components/shop/product-client-section";
import { ProductCard } from "@/components/shop/product-card";
import { COATrustSection } from "@/components/coa-trust-section";
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
  const defaultImage = product.images[0] || "/logo.png";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Product hero */}
        <section className="py-16 container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <p className="font-sans text-[10px] tracking-[0.25em] text-primary/70 uppercase">
              {product.category.name} / {product.name}
            </p>
          </div>

          {/* Product name */}
          <h1 className="font-serif text-4xl lg:text-5xl font-light text-foreground mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="font-sans text-sm text-foreground/65 leading-relaxed mb-10 max-w-xl">
            {product.description}
          </p>

          {/* Dynamic image + actions */}
          <ProductClientSection
            product={{ id: product.id, name: product.name, slug: product.slug }}
            variants={product.variants.map((v) => ({
              id: v.id,
              name: v.name,
              price: v.price,
              stock: v.stock,
            }))}
            variantImages={{}}
            defaultImage={defaultImage}
            batchNumber={currentBatch?.batchNumber ?? null}
          />
        </section>

        {/* COA Trust Section */}
        <COATrustSection compact />

        {/* Related products */}
        {related.length > 0 && (
          <section className="py-16 bg-card/40 border-t border-border">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center gap-3 mb-10">
                <Package className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-2xl font-light text-foreground">Related Products</h2>
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
    </div>
  );
}
