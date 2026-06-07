export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/navbar";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/shop/product-card";

export default async function ShopPage() {
  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    include: { category: true, variants: { orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="py-16 border-b border-border dot-pattern">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-3">Our Products</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
              Vault Peptides <em>Catalog</em>
            </h1>
            <p className="font-sans text-sm text-foreground/65 max-w-lg mx-auto">
              Every product is strictly tested for purity. Browse our full range of lab-verified research peptides and blends.
            </p>
          </div>
        </section>

        {/* Category filter */}
        <section className="border-b border-border bg-card/40 py-4 sticky top-16 z-30 backdrop-blur-sm">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              <button className="shrink-0 text-[10px] font-sans font-medium tracking-widest uppercase px-5 py-2 border border-primary bg-primary text-primary-foreground rounded-none">
                ALL
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="shrink-0 text-[10px] font-sans font-medium tracking-widest uppercase px-5 py-2 border border-border text-foreground/70 hover:border-primary hover:text-primary transition-colors rounded-none"
                >
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-16 container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <div className="col-span-full py-24 text-center font-sans text-muted-foreground">
                No products available yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
