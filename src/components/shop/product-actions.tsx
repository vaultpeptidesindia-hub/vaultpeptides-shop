"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";
import { COARequestModal } from "@/components/shop/coa-request-modal";

interface Variant { id: string; name: string; price: number; stock: number }
interface ProductActionsProps {
  product: { id: string; name: string; slug: string; image: string };
  variants: Variant[];
}

export function ProductActions({ product, variants }: ProductActionsProps) {
  const [selected, setSelected] = useState<Variant | null>(variants[0] ?? null);
  const [coaOpen, setCoaOpen] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    if (!selected) return;
    if (selected.stock === 0) { toast.error("Out of stock."); return; }
    addItem({
      variantId: selected.id,
      productId: product.id,
      productName: product.name,
      variantName: selected.name,
      price: selected.price,
      quantity: 1,
      image: product.image,
    });
    toast.success(`${product.name} ${selected.name} added to cart.`);
  };

  if (variants.length === 0)
    return <p className="font-sans text-sm text-muted-foreground italic">Contact us for pricing.</p>;

  return (
    <>
      {/* Variant selector */}
      <div className="mb-6">
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Select Size</p>
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
              {v.name.toUpperCase()}{v.stock === 0 ? " (OOS)" : ""}
            </button>
          ))}
        </div>
        {selected && (
          <p className="font-serif text-2xl font-medium text-foreground mt-4">
            ₹{selected.price.toLocaleString("en-IN")}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
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

      <COARequestModal open={coaOpen} onClose={() => setCoaOpen(false)} productName={product.name} productId={product.id} />
    </>
  );
}
