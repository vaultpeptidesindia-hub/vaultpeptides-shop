"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";
import { addToCart } from "@/actions/cart";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images?: string[];
    isFeatured: boolean;
    category?: { name: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const cart = useCart();

  const handleAddToCart = async () => {
    // Optimistic UI update
    cart.addItem({
      id: Math.random().toString(), // Temp ID for local state if needed
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
    });

    // Server update
    const res = await addToCart(product.id, 1);
    if (res.success) {
      toast.success(res.success);
    } else if (res.error && res.error.includes("login")) {
      // If error is login, we keep it in local storage only, which is fine
      toast.info("Added to local cart. Login to sync across devices.");
    } else {
      toast.error(res.error);
    }
  };

  const mainImage = product.images?.[0] || "/logo.png"; // Fallback to logo if no image

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all flex flex-col">
      <Link href={`/product/${product.slug}`} className="aspect-square bg-muted relative block overflow-hidden">
        <Image 
          src={mainImage} 
          alt={product.name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        {product.isFeatured && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
            Featured
          </div>
        )}
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">
          {product.category?.name}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold">₹{product.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
