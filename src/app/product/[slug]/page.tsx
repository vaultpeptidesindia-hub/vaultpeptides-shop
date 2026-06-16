import Navbar from "@/components/layout/navbar";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { ProductClientSection } from "@/components/shop/product-client-section";
import { ProductCard } from "@/components/shop/product-card";
import { COATrustSection } from "@/components/coa-trust-section";
import { auth } from "@/auth";
import { firstImage, parseImages } from "@/lib/images";
import { JsonLd } from "@/components/seo/json-ld";
import { productSchema, breadcrumbSchema } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | Vault Peptides`,
      description: product.description.slice(0, 160),
      url: `/product/${slug}`,
      images: parseImages(product.images).slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, session] = await Promise.all([
    db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: { orderBy: { price: "asc" } },
        batches: { include: { batch: true }, take: 1, orderBy: { assignedAt: "desc" } },
      },
    }),
    auth(),
  ]);

  if (!product) notFound();

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, status: "ACTIVE", NOT: { id: product.id } },
    take: 3,
    include: { category: true, variants: { orderBy: { price: "asc" } } },
  });

  const currentBatch = product.batches[0]?.batch ?? null;
  const defaultImage = firstImage(product.images);
  const isLoggedIn = !!session?.user?.id;

  const prices = product.variants.map((v) => v.price);
  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <JsonLd
        data={[
          productSchema({
            name: product.name,
            slug: product.slug,
            description: product.description,
            image: defaultImage,
            prices,
            inStock,
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Shop", url: "/shop" },
            { name: product.category.name, url: "/shop" },
            { name: product.name, url: `/product/${product.slug}` },
          ]),
        ]}
      />
      <Navbar />
      <main className="flex-1">
        {/* Product detail section — solid bg */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Breadcrumb */}
            <p className="font-sans text-[10px] tracking-[0.25em] text-primary/70 uppercase mb-4">
              {product.category.name} / {product.name}
            </p>

            {/* Product name + description */}
            <div className="mb-10">
              <h1 className="font-serif text-4xl lg:text-5xl font-light mb-4 leading-tight" style={{ color: "#1A0E05" }}>
                {product.name}
              </h1>
              <p className="font-sans text-sm leading-relaxed max-w-xl" style={{ color: "#3D2510" }}>
                {product.description}
              </p>
            </div>

            {/* Dynamic image + variant selector */}
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
              isLoggedIn={isLoggedIn}
            />
          </div>
        </section>

        {/* COA Trust Section */}
        <COATrustSection compact />

        {/* Related products */}
        {related.length > 0 && (
          <section style={{ backgroundColor: "#EDE1CE" }} className="py-16 border-t border-border">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center gap-3 mb-10">
                <Package className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-2xl font-light" style={{ color: "#1A0E05" }}>Related Products</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} isLoggedIn={isLoggedIn} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
