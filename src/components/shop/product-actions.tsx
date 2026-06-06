"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";
import { COARequestModal } from "@/components/shop/coa-request-modal";

interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductActionsProps {
  product: { id: string; name: string; slug: string; image: string };
  variants: Variant[];
}

export function ProductActions({ product, variants }: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants[0] ?? null
  );
  const [coaOpen, setCoaOpen] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant.");
      return;
    }
    if (selectedVariant.stock === 0) {
      toast.error("This variant is out of stock.");
      return;
    }
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      quantity: 1,
      image: product.image,
    });
    toast.success(`${product.name} ${selectedVariant.name} added to cart!`);
  };

  if (variants.length === 0) {
    return (
      <p className="text-muted-foreground italic text-sm">
        No variants available. Please contact us for pricing.
      </p>
    );
  }

  return (
    <>
      {/* Variant buttons */}
      <div className="mb-6">
        <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
          Select Size
        </p>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                selectedVariant?.id === variant.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background hover:border-primary/50 text-foreground"
              } ${variant.stock === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              disabled={variant.stock === 0}
            >
              {variant.name}
              {variant.stock === 0 && (
                <span className="ml-1.5 text-xs font-normal">(OOS)</span>
              )}
            </button>
          ))}
        </div>
        {selectedVariant && (
          <p className="mt-3 text-2xl font-bold text-primary">
            ₹{selectedVariant.price.toFixed(2)}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-16 text-lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => setCoaOpen(true)}
          className="flex-1 border-primary text-primary hover:bg-primary/10 h-16 text-lg"
        >
          <FileText className="mr-2 h-5 w-5" /> Request COA
        </Button>
      </div>

      <COARequestModal
        open={coaOpen}
        onClose={() => setCoaOpen(false)}
        productName={product.name}
        productId={product.id}
      />
    </>
  );
}
