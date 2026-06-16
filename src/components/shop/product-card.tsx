"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import { firstImage } from "@/lib/images";
import { getVariantImage } from "@/components/shop/product-client-section";
import { useCart } from "@/store/use-cart";
import { addToCart } from "@/actions/cart";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    images?: string | null;
    isFeatured: boolean;
    category?: { name: string };
    variants?: { id: string; name: string; price: number; stock?: number }[];
  };
  isLoggedIn?: boolean;
}

export function ProductCard({ product, isLoggedIn = false }: ProductCardProps) {
  const mainImage = firstImage(product.images);
  const variants = product.variants ?? [];
  const [selected, setSelected] = useState(variants[0]);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();

  // Sale price = selected variant (or base), original = 20% higher
  const salePrice = selected?.price ?? product.basePrice;
  const originalPrice = Math.round(salePrice * 1.2);
  const outOfStock = typeof selected?.stock === "number" && selected.stock === 0;

  const handleAdd = async () => {
    const variant = selected ?? variants[0];
    if (!variant) return;
    if (outOfStock) {
      toast.error("Out of stock.");
      return;
    }

    setAdding(true);
    try {
      if (isLoggedIn) {
        // Logged-in: write to DB only (Zustand is guests-only — mixing miscounts the badge).
        const res = await addToCart(variant.id, 1);
        if (res.error) toast.error(res.error);
        else toast.success(`${product.name} ${variant.name} added to cart.`);
      } else {
        addItem({
          variantId: variant.id,
          productId: product.id,
          productName: product.name,
          variantName: variant.name,
          price: variant.price,
          quantity: 1,
          image: getVariantImage(product.slug, variant.name, mainImage),
        });
        toast.success(`${product.name} ${variant.name} added to cart.`);
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square bg-background/50 block overflow-hidden">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />
        {/* Sale badge */}
        <span className="absolute top-3 right-3 text-[9px] font-sans font-semibold tracking-widest text-white uppercase bg-green-600 px-2 py-1 rounded-sm">
          20% OFF
        </span>
        {product.isFeatured && (
          <span className="absolute top-3 left-3 text-[9px] font-sans font-medium tracking-widest text-primary/80 uppercase bg-background/80 px-2 py-1 rounded-sm">
            Featured
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        <p className="text-[10px] font-sans tracking-[0.2em] text-muted-foreground uppercase mb-2">
          {product.category?.name}
        </p>

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-primary transition-colors mb-3 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Variant selector — pick a size right on the card */}
        {variants.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {variants.map((v) => {
              const isSel = selected?.id === v.id;
              const oos = typeof v.stock === "number" && v.stock === 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelected(v)}
                  disabled={oos}
                  className={`text-[9px] font-sans font-medium tracking-widest uppercase border px-2 py-0.5 rounded-sm transition-colors ${
                    isSel
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/30 bg-primary/5 text-primary/80 hover:border-primary"
                  } ${oos ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {v.name}{oos ? " (OOS)" : ""}
                </button>
              );
            })}
          </div>
        )}

        {/* Description */}
        <p className="text-xs font-sans text-foreground/60 line-clamp-3 leading-relaxed mb-5 flex-1">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-semibold text-foreground">
              ₹{salePrice.toLocaleString("en-IN")}
            </span>
            <span className="font-sans text-xs text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          </div>
          {variants.length > 0 ? (
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={adding || outOfStock}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[10px] tracking-widest font-sans font-medium h-8 px-3 gap-1 shrink-0"
            >
              <ShoppingCart className="h-3 w-3" />
              {adding ? "ADDING…" : outOfStock ? "OOS" : "ADD"}
            </Button>
          ) : (
            <Link href={`/product/${product.slug}`}>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[10px] tracking-widest font-sans font-medium h-8 px-4 gap-1 shrink-0"
              >
                SHOP NOW <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
