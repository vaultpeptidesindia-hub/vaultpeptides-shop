import Navbar from "@/components/layout/navbar";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ShopPage() {
  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Research Catalog</h1>
            <p className="text-muted-foreground">Premium research compounds and laboratory chemicals.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search compounds..." className="pl-10 bg-card border-border" />
            </div>
            <Button variant="outline" className="border-border">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-8 mb-4 no-scrollbar">
          <Badge className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-full cursor-pointer shrink-0">
            All Products
          </Badge>
          {categories.map((cat) => (
            <Badge key={cat.id} variant="outline" className="px-6 py-2 border-border hover:border-primary text-sm rounded-full cursor-pointer shrink-0">
              {cat.name}
            </Badge>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground italic">
              No products found in the catalog.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Footer from "@/components/layout/footer";
