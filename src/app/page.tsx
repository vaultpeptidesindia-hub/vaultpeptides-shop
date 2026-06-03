import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Beaker, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export default async function Home() {
  const featuredProducts = await db.product.findMany({
    where: { isFeatured: true, status: "ACTIVE" },
    take: 4,
    include: { category: true }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
              New Research Chemicals Available
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Unlocking the Future of <span className="text-primary italic">Biotech Research</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Vault Peptides provides high-purity, laboratory-tested research compounds for scientific exploration. Our commitment to quality ensures reliable results for your R&D projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 px-8">
                  Browse Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-lg h-14 px-8">
                Learn About Purity
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold">99%+ Purity Guaranteed</h3>
              <p className="text-muted-foreground">Every batch undergoes rigorous HPLC and MS testing to ensure absolute purity for your research.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Beaker size={32} />
              </div>
              <h3 className="text-xl font-bold">Scientific Excellence</h3>
              <p className="text-muted-foreground">Manufactured in state-of-the-art facilities following international laboratory standards.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold">Secure Delivery</h3>
              <p className="text-muted-foreground">Discreet packaging and tracked shipping worldwide to protect your sensitive research materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Compounds</h2>
            <p className="text-muted-foreground">Our most popular research peptides and chemicals.</p>
          </div>
          <Link href="/shop">
            <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
              View all products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div key={product.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all">
                <Link href={`/product/${product.slug}`} className="aspect-square bg-muted relative block">
                  <Image 
                    src={product.images[0] || "/logo.png"} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </Link>
                <div className="p-6">
                  <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">
                    {product.category.name}
                  </div>
                  <h3 className="text-lg font-bold mb-4 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">₹{product.price}</span>
                    <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground italic">
              New compounds arriving soon.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/footer";
