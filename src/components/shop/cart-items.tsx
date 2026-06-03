"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/use-cart";
import { removeFromCart, updateCartItemQuantity } from "@/actions/cart";
import { toast } from "sonner";

interface CartItemsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dbCart: any;
  isLoggedIn: boolean;
}

export function CartItems({ dbCart, isLoggedIn }: CartItemsProps) {
  const cartStore = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = isLoggedIn ? (dbCart?.items || []) : (cartStore.items as any[]);
  const totalPrice = isLoggedIn 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? items.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0)
    : cartStore.totalPrice();

  const handleRemove = async (itemId: string, productId: string) => {
    if (isLoggedIn) {
      const res = await removeFromCart(itemId);
      if (res.success) toast.success(res.success);
      else toast.error(res.error);
    } else {
      cartStore.removeItem(productId);
    }
  };

  const handleQuantity = async (itemId: string, productId: string, newQty: number) => {
    if (newQty < 1) return;
    
    if (isLoggedIn) {
      await updateCartItemQuantity(itemId, newQty);
    } else {
      cartStore.updateQuantity(productId, newQty);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-card/20">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added any research compounds yet.</p>
        <Link href="/shop">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {items.map((item: any) => {
          const product = isLoggedIn ? item.product : item;
          const id = isLoggedIn ? item.id : item.productId;
          const productId = isLoggedIn ? item.productId : item.productId;

          return (
            <div key={id} className="flex gap-6 p-6 bg-card border border-border rounded-2xl relative group">
              <div className="w-24 h-24 bg-muted rounded-xl relative overflow-hidden shrink-0">
                <Image 
                  src={product.images?.[0] || item.image || "/logo.png"} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{product.name}</h3>
                  <button 
                    onClick={() => handleRemove(id, productId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border rounded-lg bg-background">
                    <button 
                      onClick={() => handleQuantity(id, productId, item.quantity - 1)}
                      className="p-2 hover:text-primary transition-colors border-r border-border"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantity(id, productId, item.quantity + 1)}
                      className="p-2 hover:text-primary transition-colors border-l border-border"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-lg font-bold">₹{(product.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-card border border-border rounded-3xl p-8 sticky top-28">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-primary font-medium">Calculated at checkout</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg">
              Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          {!isLoggedIn && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              <Link href="/login" className="text-primary hover:underline">Login</Link> to save your cart across devices.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
