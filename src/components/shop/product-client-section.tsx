"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText, ShieldCheck, FlaskConical, Truck, Award } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";
import { COARequestModal } from "@/components/shop/coa-request-modal";

interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductClientSectionProps {
  product: {
    id: string;
    name: string;
    slug: string;
  };
  variants: Variant[];
  variantImages: Record<string, string>; // variant name → image URL
  defaultImage: string;
  batchNumber?: string | null;
}

// Map product slug + variant name → image path
export function getVariantImage(
  productSlug: string,
  variantName: string,
  fallback: string
): string {
  const key = variantName.toLowerCase();
  const map: Record<string, Record<string, string>> = {
    retatrutide: {
      "10mg": "/products/RETATRUTIDE 10mg.png",
      "15mg": "/products/RETATRUTIDE 15mg.png",
      "20mg": "/products/RETATRUTIDE 20mg.png",
    },
    tesamorelin: {
      "5mg": "/products/TESAMORELIN 5mg.png",
      "10mg": "/products/TESAMORELIN 10mg.png",
    },
    "ghk-cu": {
      "50mg": "/products/GHKCu 50mg.png",
      "100mg": "/products/GHKCu 100mg.png",
    },
    "mots-c": {
      "10mg": "/products/MOTSC 10mg.png",
      "20mg": "/products/MOTSC 10mg.png",
      "40mg": "/products/MOTSC 40mg.png",
    },
    semax: {
      "10mg": "/products/Semax.png",
    },
    selank: {
      "10mg": "/products/Selank.png",
    },
    "glow-blend": {
      "80mg": "/products/GLOW 80mg.png",
    },
    "klow-blend": {
      "80mg": "/products/klow 80mg.png",
    },
    "wolverine-blend": {
      "10mg": "/products/WOLVERINE BLEND 10mg.png",
      "20mg": "/products/WOLVERINE BLEND 20mg.png",
    },
    "cjc-ipa": {
      "10mg": "/products/CJC-IPA-10mg.png",
    },
  };
  return map[productSlug]?.[key] ?? fallback;
}

export function ProductClientSection({
  product,
  variants,
  defaultImage,
  batchNumber,
}: ProductClientSectionProps) {
  const [selected, setSelected] = useState<Variant | null>(variants[0] ?? null);
  const [coaOpen, setCoaOpen] = useState(false);
  const { addItem } = useCart();

  const currentImage = selected
    ? getVariantImage(product.slug, selected.name, defaultImage)
    : defaultImage;

  const salePrice = selected?.price ?? 0;
  const originalPrice = Math.round(salePrice * 1.2);

  const handleAdd = () => {
    if (!selected) return;
    if (selected.stock === 0) {
      toast.error("Out of stock.");
      return;
    }
    addItem({
      variantId: selected.id,
      productId: product.id,
      productName: product.name,
      variantName: selected.name,
      price: selected.price,
      quantity: 1,
      image: currentImage,
    });
    toast.success(`${product.name} ${selected.name} added to cart.`);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16 items-start">
      {/* Dynamic product image */}
      <div className="relative aspect-square bg-card border border-border rounded-lg overflow-hidden">
        <Image
          src={currentImage}
          alt={`${product.name}${selected ? ` — ${selected.name}` : ""}`}
          fill
          className="object-contain p-10 transition-opacity duration-300"
          priority
        />
        {batchNumber && (
          <div className="absolute bottom-4 left-4 bg-background/90 border border-border rounded px-3 py-2">
            <p className="font-sans text-[9px] text-muted-foreground uppercase tracking-widest">
              Batch No.
            </p>
            <p className="font-mono text-xs font-bold text-foreground">{batchNumber}</p>
          </div>
        )}
        {selected && variants.length > 1 && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[9px] font-sans font-medium tracking-widest uppercase px-2.5 py-1 rounded-sm">
            {selected.name}
          </div>
        )}
      </div>

      {/* Variant selector + info */}
      <div>
        {/* Variant selector */}
        {variants.length > 0 && (
          <div className="mb-6">
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
              Select Size
            </p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelected(v)}
                  disabled={v.stock === 0}
                  className={`px-5 py-2 text-xs font-sans font-medium tracking-widest border transition-all rounded-none ${
                    selected?.id === v.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary hover:text-primary"
                  } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {v.name.toUpperCase()}
                  {v.stock === 0 ? " (OOS)" : ""}
                </button>
              ))}
            </div>

            {/* Price display */}
            {selected && (
              <div className="flex items-baseline gap-3 mt-4">
                <p className="font-serif text-2xl font-medium text-foreground">
                  ₹{salePrice.toLocaleString("en-IN")}
                </p>
                <p className="font-sans text-base text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </p>
                <span className="text-[10px] font-sans font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-sm tracking-widest">
                  20% OFF
                </span>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button
            onClick={handleAdd}
            disabled={!selected || selected.stock === 0}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-none font-sans text-xs tracking-widest"
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> ADD TO CART
          </Button>
          <Button
            variant="outline"
            onClick={() => setCoaOpen(true)}
            className="flex-1 border-border text-foreground hover:border-primary hover:text-primary h-12 rounded-none font-sans text-xs tracking-widest"
          >
            <FileText className="mr-2 h-4 w-4" /> REQUEST COA
          </Button>
        </div>

        {/* Product details grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-8 mb-8">
          {[
            { label: "Purity", value: "≥ 99%" },
            { label: "Storage", value: "2–8°C Recommended" },
            { label: "Origin", value: "Research Grade" },
            { label: "COA", value: "Available on Request" },
          ].map((detail) => (
            <div key={detail.label}>
              <p className="font-sans text-[9px] tracking-widest uppercase text-muted-foreground mb-1">
                {detail.label}
              </p>
              <p className="font-sans text-sm font-medium text-foreground">{detail.value}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3">
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

      <COARequestModal
        open={coaOpen}
        onClose={() => setCoaOpen(false)}
        productName={product.name}
        productId={product.id}
      />
    </div>
  );
}
