import Navbar from "@/components/layout/navbar";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ShieldCheck, Beaker, Truck } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true }
  });

  if (!product) notFound();

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
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20">
              {product.category.name}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
            <div className="text-3xl font-bold text-primary mb-8">₹{product.price.toFixed(2)}</div>
            
            <div className="space-y-6 mb-10">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-16 text-lg">
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10 h-16 text-lg">
                View COA
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-8 border-t border-border">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-primary h-5 w-5 mt-1" />
                <div>
                  <h4 className="font-bold text-sm">Lab Tested</h4>
                  <p className="text-xs text-muted-foreground">Certified purity above 99%</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Beaker className="text-primary h-5 w-5 mt-1" />
                <div>
                  <h4 className="font-bold text-sm">Research Only</h4>
                  <p className="text-xs text-muted-foreground">For laboratory use exclusively</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="text-primary h-5 w-5 mt-1" />
                <div>
                  <h4 className="font-bold text-sm">Fast Shipping</h4>
                  <p className="text-xs text-muted-foreground">Tracked delivery nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
