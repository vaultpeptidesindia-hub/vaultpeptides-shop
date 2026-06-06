import Navbar from "@/components/layout/navbar";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Beaker, Truck, Award } from "lucide-react";
import Footer from "@/components/layout/footer";
import { ProductActions } from "@/components/shop/product-actions";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

  const currentBatch = product.batches[0]?.batch ?? null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="aspect-square bg-card border border-border rounded-3xl relative overflow-hidden">
            <Image
              src={product.images[0] || "/logo.png"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {currentBatch && (
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2">
                <p className="text-xs text-muted-foreground">Batch No.</p>
                <p className="text-sm font-bold font-mono">{currentBatch.batchNumber}</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20">
              {product.category.name}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {product.name}
            </h1>
            <div className="text-3xl font-bold text-primary mb-2">
              {product.variants.length > 0
                ? `From ₹${product.variants[0].price.toFixed(2)}`
                : `₹${product.basePrice.toFixed(2)}`}
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              {product.variants.length} variant{product.variants.length !== 1 ? "s" : ""} available
            </p>

            <div className="space-y-4 mb-10">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variant selector + Add to Cart — client component */}
            <ProductActions
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.images[0] || "/logo.png",
              }}
              variants={product.variants.map((v) => ({
                id: v.id,
                name: v.name,
                price: v.price,
                stock: v.stock,
              }))}
            />

            {/* Trust badges */}
            <div className="grid sm:grid-cols-2 gap-6 pt-8 border-t border-border mt-8">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-primary h-5 w-5 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Lab Tested</h4>
                  <p className="text-xs text-muted-foreground">Certified purity above 99%</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="text-primary h-5 w-5 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">COA Available</h4>
                  <p className="text-xs text-muted-foreground">Certificates of Analysis on request</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Beaker className="text-primary h-5 w-5 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Research Only</h4>
                  <p className="text-xs text-muted-foreground">For laboratory use exclusively</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="text-primary h-5 w-5 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Fast Shipping</h4>
                  <p className="text-xs text-muted-foreground">Tracked delivery nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
