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

  // For logged-in users: DB cart items (structure: item.variant.product)
  // For guests: Zustand store items (CartItem type)
  const dbItems = dbCart?.items || [];
  const guestItems = cartStore.items;

  const totalPrice = isLoggedIn
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? dbItems.reduce((acc: number, item: any) => acc + (item.variant?.price ?? 0) * item.quantity, 0)
    : cartStore.totalPrice();

  const handleRemove = async (dbItemId: string, guestVariantId: string) => {
    if (isLoggedIn) {
      const res = await removeFromCart(dbItemId);
      if (res.success) toast.success(res.success);
      else toast.error(res.error);
    } else {
      cartStore.removeItem(guestVariantId);
    }
  };

  const handleQuantity = async (dbItemId: string, guestVariantId: string, newQty: number) => {
    if (newQty < 1) return;
    if (isLoggedIn) {
      await updateCartItemQuantity(dbItemId, newQty);
    } else {
      cartStore.updateQuantity(guestVariantId, newQty);
    }
  };

  const isEmpty = isLoggedIn ? dbItems.length === 0 : guestItems.length === 0;

  if (isEmpty) {
    return (
      <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/20">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <ShoppingBag size={40} />
        </div>
        <h2 className="font-serif text-2xl font-light mb-2 text-foreground">Your cart is empty</h2>
        <p className="font-sans text-sm text-foreground/65 mb-8">
          You haven&apos;t added any research compounds yet.
        </p>
        <Link href="/shop">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-sans text-xs tracking-widest h-11 px-8">
            BROWSE PRODUCTS
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-12">
      {/* Items list */}
      <div className="lg:col-span-2 space-y-4">
        {isLoggedIn ? (
          // Logged-in: render from DB cart
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dbItems.map((item: any) => {
            const product = item.variant?.product;
            const variant = item.variant;
            if (!product || !variant) return null;
            return (
              <div key={item.id} className="flex gap-5 p-5 bg-card border border-border rounded-lg group">
                <div className="w-20 h-20 bg-background rounded-lg relative overflow-hidden shrink-0 border border-border">
                  <Image
                    src={product.images?.[0] || "/logo.png"}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-sans font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="font-sans text-xs text-primary/80 mt-0.5">{variant.name}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id, variant.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors ml-2 shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-md bg-background">
                      <button
                        onClick={() => handleQuantity(item.id, variant.id, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:text-primary transition-colors border-r border-border"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs font-medium text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity(item.id, variant.id, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:text-primary transition-colors border-l border-border"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="font-sans font-semibold text-sm text-foreground">
                      ₹{(variant.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // Guest: render from Zustand store
          guestItems.map((item) => (
            <div key={item.variantId} className="flex gap-5 p-5 bg-card border border-border rounded-lg group">
              <div className="w-20 h-20 bg-background rounded-lg relative overflow-hidden shrink-0 border border-border">
                <Image
                  src={item.image || "/logo.png"}
                  alt={item.productName}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-sans font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {item.productName}
                    </h3>
                    <p className="font-sans text-xs text-primary/80 mt-0.5">{item.variantName}</p>
                  </div>
                  <button
                    onClick={() => handleRemove("", item.variantId)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-2 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-md bg-background">
                    <button
                      onClick={() => handleQuantity("", item.variantId, item.quantity - 1)}
                      className="px-2.5 py-1.5 hover:text-primary transition-colors border-r border-border"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-xs font-medium text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity("", item.variantId, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:text-primary transition-colors border-l border-border"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="font-sans font-semibold text-sm text-foreground">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order summary */}
      <div className="lg:col-span-1">
        <div className="bg-card border border-border rounded-lg p-6 sticky top-28">
          <h2 className="font-serif text-xl font-light mb-5 text-foreground">Order Summary</h2>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm font-sans text-foreground/65">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-foreground/65">Shipping</span>
              <span className="text-primary font-medium">Calculated at checkout</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex justify-between font-sans font-semibold text-foreground">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-none font-sans text-xs tracking-widest">
              PROCEED TO CHECKOUT <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          {!isLoggedIn && (
            <p className="font-sans text-xs text-foreground/60 text-center mt-4">
              <Link href="/login" className="text-primary hover:underline">Login</Link>{" "}
              to save your cart across devices.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
