"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText, ShieldCheck, FlaskConical, Truck, Award } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { addToCart } from "@/actions/cart";
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
  variantImages: Record<string, string>;
  defaultImage: string;
  batchNumber?: string | null;
  isLoggedIn?: boolean;
}

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
    semax: { "10mg": "/products/Semax.png" },
    selank: { "10mg": "/products/Selank.png" },
    "glow-blend": { "80mg": "/products/GLOW 80mg.png" },
    "klow-blend": { "80mg": "/products/klow 80mg.png" },
    "wolverine-blend": {
      "10mg": "/products/WOLVERINE BLEND 10mg.png",
      "20mg": "/products/WOLVERINE BLEND 20mg.png",
    },
    "cjc-ipa": { "10mg": "/products/CJC-IPA-10mg.png" },
  };
  return map[productSlug]?.[key] ?? fallback;
}

export function ProductClientSection({
  product,
  variants,
  defaultImage,
  batchNumber,
  isLoggedIn = false,
}: ProductClientSectionProps) {
  const [selected, setSelected] = useState<Variant | null>(variants[0] ?? null);
  const [coaOpen, setCoaOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();

  const currentImage = selected
    ? getVariantImage(product.slug, selected.name, defaultImage)
    : defaultImage;

  const salePrice = selected?.price ?? 0;
  const originalPrice = Math.round(salePrice * 1.2);

  const handleAdd = async () => {
    if (!selected) return;
    if (selected.stock === 0) {
      toast.error("Out of stock.");
      return;
    }

    setAdding(true);
    try {
      if (isLoggedIn) {
        // Logged-in users: write to DB only — Zustand is for guests only.
        // Mixing both caused badge count to be wrong (Zustand had stale extras).
        const res = await addToCart(selected.id, 1);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(`${product.name} ${selected.name} added to cart.`);
        }
      } else {
        // Guest users: Zustand store only
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
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16 items-start">
      {/* Dynamic product image */}
      <div
        className="relative aspect-square rounded-lg overflow-hidden border border-border"
        style={{ backgroundColor: "#FAF5EE" }}
      >
        <Image
          src={currentImage}
          alt={`${product.name}${selected ? ` — ${selected.name}` : ""}`}
          fill
          className="object-contain p-10 transition-opacity duration-300"
          priority
        />
        {batchNumber && (
          <div className="absolute bottom-4 left-4 border border-border rounded px-3 py-2" style={{ backgroundColor: "rgba(245,237,224,0.9)" }}>
            <p className="font-sans text-[9px] uppercase tracking-widest" style={{ color: "#6B5A42" }}>Batch No.</p>
            <p className="font-mono text-xs font-bold" style={{ color: "#1A0E05" }}>{batchNumber}</p>
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
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "#6B5A42" }}>
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
                      : "border-border hover:border-primary hover:text-primary"
                  } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                  style={selected?.id !== v.id ? { color: "#1A0E05", borderColor: "#C8B89E" } : {}}
                >
                  {v.name.toUpperCase()}{v.stock === 0 ? " (OOS)" : ""}
                </button>
              ))}
            </div>

            {/* Price */}
            {selected && (
              <div className="flex items-baseline gap-3 mt-4">
                <p className="font-serif text-2xl font-medium" style={{ color: "#1A0E05" }}>
                  ₹{salePrice.toLocaleString("en-IN")}
                </p>
                <p className="font-sans text-base line-through" style={{ color: "#8B7355" }}>
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
            disabled={!selected || selected.stock === 0 || adding}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-none font-sans text-xs tracking-widest"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {adding ? "ADDING…" : "ADD TO CART"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setCoaOpen(true)}
            className="flex-1 h-12 rounded-none font-sans text-xs tracking-widest"
            style={{ borderColor: "#C8B89E", color: "#1A0E05" }}
          >
            <FileText className="mr-2 h-4 w-4" /> REQUEST COA
          </Button>
        </div>

        {/* Product details */}
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-8 mb-8">
          {[
            { label: "Purity", value: "≥ 99%" },
            { label: "Storage", value: "2–8°C Recommended" },
            { label: "Origin", value: "Research Grade" },
            { label: "COA", value: "Available on Request" },
          ].map((detail) => (
            <div key={detail.label}>
              <p className="font-sans text-[9px] tracking-widest uppercase mb-1" style={{ color: "#8B7355" }}>{detail.label}</p>
              <p className="font-sans text-sm font-medium" style={{ color: "#1A0E05" }}>{detail.value}</p>
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
            <div key={b.text} className="flex items-center gap-2 text-xs font-sans" style={{ color: "#6B5A42" }}>
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
