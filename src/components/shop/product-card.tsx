"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { firstImage } from "@/lib/images";

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
    variants?: { id: string; name: string; price: number }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = firstImage(product.images);
  const variants = product.variants ?? [];

  // Sale price = basePrice, original = 20% higher
  const salePrice = product.basePrice;
  const originalPrice = Math.round(salePrice * 1.2);

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

        {/* Variant pills */}
        {variants.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {variants.map((v) => (
              <span
                key={v.id}
                className="text-[9px] font-sans font-medium tracking-widest text-primary/80 uppercase border border-primary/30 bg-primary/5 px-2 py-0.5 rounded-sm"
              >
                {v.name}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-xs font-sans text-foreground/60 line-clamp-3 leading-relaxed mb-5 flex-1">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-base font-semibold text-foreground">
                From ₹{salePrice.toLocaleString("en-IN")}
              </span>
              <span className="font-sans text-xs text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <Link href={`/product/${product.slug}`}>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[10px] tracking-widest font-sans font-medium h-8 px-4 gap-1"
            >
              SHOP NOW <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
