export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, ShieldCheck, FlaskConical, Truck, Award } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ProductCard } from "@/components/shop/product-card";
import { COATrustSection } from "@/components/coa-trust-section";
import { BrandSiteCallout } from "@/components/brand-site-callout";

export default async function Home() {
  const featuredProducts = await db.product.findMany({
    where: { isFeatured: true, status: "ACTIVE" },
    take: 6,
    include: { category: true, variants: { orderBy: { price: "asc" } } },
  });

  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  return (
    // Outer div has no background — the fixed 3D spine canvas shows through the hero section
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── Hero — transparent so the 3D spine shows through ── */}
      <section className="relative min-h-[100svh] flex items-center justify-center md:justify-start overflow-hidden">
        {/* Card shifts left on desktop so the glowing 3D spine reads on the right;
            frosted glass keeps text crisp while letting the spine show through. */}
        <div
          className="relative z-10 rounded-2xl p-9 md:p-14 max-w-xl mx-4 md:ml-[6vw] lg:ml-[9vw] text-center md:text-left border shadow-2xl backdrop-blur-md"
          style={{ backgroundColor: "rgba(245,237,224,0.82)", borderColor: "rgba(122,72,40,0.22)" }}
        >
          <p className="inline-flex items-center gap-2 text-[10px] font-sans font-medium tracking-[0.25em] text-primary/70 uppercase mb-6">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" />
            Unlock Your Biological Potential
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight mb-6" style={{ color: "#1A0E05" }}>
            The Backbone<br />
            <em>of Vitality.</em>
          </h1>
          <p className="text-sm font-sans leading-relaxed mb-3" style={{ color: "#3D2510" }}>
            Welcome to Vault Peptides. We supply premium, lab-tested peptides designed to support peak physical performance, faster recovery, and healthy ageing.
          </p>
          <p className="text-sm font-sans leading-relaxed mb-10" style={{ color: "#5C3D20" }}>
            Every batch is strictly tested for purity. Explore our catalog to find the highest quality products for your research and wellness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link href="/shop">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-xs tracking-widest font-sans font-medium rounded-none">
                SHOP NOW <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/why-vault">
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 h-12 px-8 text-xs tracking-widest font-sans font-medium rounded-none">
                WHY VAULT
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex justify-center md:justify-start animate-bounce">
            <ArrowDown className="h-5 w-5 text-primary/40" />
          </div>
        </div>
      </section>

      {/* ── Trust strip ────────────────────────────────────── */}
      <section className="border-y border-border py-8" style={{ backgroundColor: "#EDE1CE" }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: ShieldCheck, label: "99%+ Purity", sub: "HPLC & MS Certified" },
              { icon: FlaskConical, label: "Lab Tested", sub: "Every Batch" },
              { icon: Award, label: "COA Available", sub: "On Request" },
              { icon: Truck, label: "Fast Shipping", sub: "Pan India" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <item.icon className="h-5 w-5 text-primary" />
                <div className="font-serif text-base font-semibold" style={{ color: "#1A0E05" }}>{item.label}</div>
                <div className="text-[11px] font-sans tracking-wider uppercase" style={{ color: "#6B5A42" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: "#F5EDE0" }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-3">Our Catalog</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light" style={{ color: "#1A0E05" }}>Premium Research Compounds</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 h-12 px-10 text-xs tracking-widest font-sans font-medium rounded-none">
                VIEW FULL CATALOG <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Main brand site cross-link ──────────────────────── */}
      <BrandSiteCallout className="border-y border-border" />

      {/* ── COA Trust Section ───────────────────────────────── */}
      <COATrustSection />

      {/* ── Purity section ─────────────────────────────────── */}
      <section className="py-24 border-y border-border" style={{ backgroundColor: "#EDE1CE" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-3">Strict Lab Testing</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-8" style={{ color: "#1A0E05" }}>
            99%+ <em>Purity Standard</em>
          </h2>
          <p className="font-sans leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: "#3D2510" }}>
            When it comes to your body and your research, purity is everything. Vault Peptides promises products that are over 99% pure, and we prove it with strict, independent lab testing.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="border border-border rounded-lg p-8" style={{ backgroundColor: "#FAF5EE" }}>
              <h3 className="font-serif text-xl font-semibold mb-4" style={{ color: "#1A0E05" }}>How We Test Our Products</h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "#3D2510" }}>
                We use advanced lab testing methods — HPLC and Mass Spectrometry — on every single batch. This guarantees our peptides have no cheap fillers, damaged molecules, or harmful leftovers from manufacturing.
              </p>
            </div>
            <div className="border border-primary/20 rounded-lg p-8" style={{ backgroundColor: "#FAF5EE" }}>
              <h3 className="font-serif text-xl font-semibold mb-4 text-primary">We Test Everything Twice</h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "#3D2510" }}>
                We double-check every single batch. After receiving the product from our manufacturer, we test it again to make absolutely sure it is safe and pure. No fakes. No edited photos. Just pure, honest results.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <Link href="/purity">
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 h-12 px-10 text-xs tracking-widest font-sans font-medium rounded-none">
                LEARN ABOUT PURITY
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: "#F5EDE0" }}>
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-3">Ready to Start?</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6" style={{ color: "#1A0E05" }}>
            Explore Our <em>Research Catalog</em>
          </h2>
          <p className="font-sans mb-10 max-w-lg mx-auto" style={{ color: "#3D2510" }}>
            Browse our complete range of lab-tested peptides and research compounds. Every product ships with a COA on request.
          </p>
          <Link href="/shop">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-12 text-xs tracking-widest font-sans font-medium rounded-none">
              BROWSE ALL PRODUCTS
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
