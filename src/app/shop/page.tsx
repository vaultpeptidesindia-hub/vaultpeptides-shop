export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/navbar";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ProductCard } from "@/components/shop/product-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Research Peptides",
  description:
    "Browse the full Vault Peptides catalog — lab-tested research peptides and blends with 99%+ purity. COA available on request. Fast pan-India shipping.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    include: { category: true, variants: { orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1">
        {/* Header — solid bg */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-16 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-3">Our Products</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-4" style={{ color: "#1A0E05" }}>
              Vault Peptides <em>Catalog</em>
            </h1>
            <p className="font-sans text-sm max-w-lg mx-auto" style={{ color: "#3D2510" }}>
              Every product is strictly tested for purity. Browse our full range of lab-verified research peptides and blends.
            </p>
          </div>
        </section>

        {/* Category filter */}
        <section style={{ backgroundColor: "#EDE1CE" }} className="border-b border-border py-4 sticky top-20 z-30 backdrop-blur-sm">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              <button className="shrink-0 text-[10px] font-sans font-medium tracking-widest uppercase px-5 py-2 border border-primary bg-primary text-primary-foreground rounded-none">
                ALL
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="shrink-0 text-[10px] font-sans font-medium tracking-widest uppercase px-5 py-2 border border-border rounded-none hover:border-primary hover:text-primary transition-colors"
                  style={{ color: "#3D2510" }}
                >
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-24 text-center font-sans" style={{ color: "#6B5A42" }}>
                  No products available yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
