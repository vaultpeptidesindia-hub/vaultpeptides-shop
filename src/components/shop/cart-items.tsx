"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";
import { removeFromCart, updateCartItemQuantity } from "@/actions/cart";
import { toast } from "sonner";

interface CartItemsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dbCart: any;
  isLoggedIn: boolean;
}

export function CartItems({ dbCart, isLoggedIn }: CartItemsProps) {
  const [hydrated, setHydrated] = useState(false);
  const cartStore = useCart();

  // Wait for client hydration so Zustand can load from localStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // For logged-in users, use DB cart. For guests, use Zustand store.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbItems: any[] = dbCart?.items ?? [];
  const guestItems = cartStore.items;
  const isEmpty = isLoggedIn ? dbItems.length === 0 : guestItems.length === 0;

  const totalPrice = isLoggedIn
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? dbItems.reduce((acc: number, item: any) => acc + (item.variant?.price ?? 0) * item.quantity, 0)
    : cartStore.totalPrice();

  const handleRemoveDB = async (dbItemId: string) => {
    const res = await removeFromCart(dbItemId);
    if (res.success) toast.success("Item removed.");
    else toast.error(res.error);
  };

  const handleQuantityDB = async (dbItemId: string, newQty: number) => {
    if (newQty < 1) return;
    await updateCartItemQuantity(dbItemId, newQty);
  };

  if (isEmpty) {
    return (
      <div
        className="text-center py-20 border border-dashed border-border rounded-2xl"
        style={{ backgroundColor: "#EDE1CE" }}
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary" style={{ backgroundColor: "rgba(107,53,32,0.1)" }}>
          <ShoppingBag size={40} />
        </div>
        <h2 className="font-serif text-2xl font-light mb-2" style={{ color: "#1A0E05" }}>Your cart is empty</h2>
        <p className="font-sans text-sm mb-8" style={{ color: "#3D2510" }}>
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dbItems.map((item: any) => {
            const product = item.variant?.product;
            const variant = item.variant;
            if (!product || !variant) return null;
            return (
              <div key={item.id} className="flex gap-5 p-5 border border-border rounded-lg" style={{ backgroundColor: "#EDE1CE" }}>
                <div className="w-20 h-20 rounded-lg relative overflow-hidden shrink-0 border border-border" style={{ backgroundColor: "#FAF5EE" }}>
                  <Image src={product.images?.[0] || "/logo.png"} alt={product.name} fill className="object-contain p-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-sans font-semibold text-sm" style={{ color: "#1A0E05" }}>{product.name}</h3>
                      <p className="font-sans text-xs text-primary mt-0.5">{variant.name}</p>
                    </div>
                    <button onClick={() => handleRemoveDB(item.id)} className="text-muted-foreground hover:text-destructive transition-colors ml-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-md" style={{ backgroundColor: "#FAF5EE" }}>
                      <button onClick={() => handleQuantityDB(item.id, item.quantity - 1)} className="px-2.5 py-1.5 hover:text-primary transition-colors border-r border-border">
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs font-medium" style={{ color: "#1A0E05" }}>{item.quantity}</span>
                      <button onClick={() => handleQuantityDB(item.id, item.quantity + 1)} className="px-2.5 py-1.5 hover:text-primary transition-colors border-l border-border">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-sans font-semibold text-sm" style={{ color: "#1A0E05" }}>
                      ₹{(variant.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          guestItems.map((item) => (
            <div key={item.variantId} className="flex gap-5 p-5 border border-border rounded-lg" style={{ backgroundColor: "#EDE1CE" }}>
              <div className="w-20 h-20 rounded-lg relative overflow-hidden shrink-0 border border-border" style={{ backgroundColor: "#FAF5EE" }}>
                <Image src={item.image || "/logo.png"} alt={item.productName} fill className="object-contain p-2" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-sans font-semibold text-sm" style={{ color: "#1A0E05" }}>{item.productName}</h3>
                    <p className="font-sans text-xs text-primary mt-0.5">{item.variantName}</p>
                  </div>
                  <button onClick={() => cartStore.removeItem(item.variantId)} className="text-muted-foreground hover:text-destructive transition-colors ml-2">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-md" style={{ backgroundColor: "#FAF5EE" }}>
                    <button onClick={() => cartStore.updateQuantity(item.variantId, item.quantity - 1)} className="px-2.5 py-1.5 hover:text-primary transition-colors border-r border-border">
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-xs font-medium" style={{ color: "#1A0E05" }}>{item.quantity}</span>
                    <button onClick={() => cartStore.updateQuantity(item.variantId, item.quantity + 1)} className="px-2.5 py-1.5 hover:text-primary transition-colors border-l border-border">
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-sans font-semibold text-sm" style={{ color: "#1A0E05" }}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order summary */}
      <div className="lg:col-span-1">
        <div className="border border-border rounded-lg p-6 sticky top-24" style={{ backgroundColor: "#EDE1CE" }}>
          <h2 className="font-serif text-xl font-light mb-5" style={{ color: "#1A0E05" }}>Order Summary</h2>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm font-sans" style={{ color: "#3D2510" }}>
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span style={{ color: "#3D2510" }}>Shipping</span>
              <span className="text-primary font-medium">Calculated at checkout</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-sans font-semibold" style={{ color: "#1A0E05" }}>
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
            <p className="font-sans text-xs text-center mt-4" style={{ color: "#6B5A42" }}>
              <Link href="/login" className="text-primary hover:underline">Login</Link>{" "}
              to save your cart across devices.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
