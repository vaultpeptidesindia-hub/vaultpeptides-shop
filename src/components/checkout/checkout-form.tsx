"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { processCheckout } from "@/actions/checkout";
import { toast } from "sonner";
import { useCart } from "@/store/use-cart";
import { MessageCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface DbItem {
  variantId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutFormProps {
  isLoggedIn: boolean;
  dbItems: DbItem[];
}

export function CheckoutForm({ isLoggedIn, dbItems }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const cartStore = useCart();

  // Logged-in → use DB items. Guest → use Zustand items.
  const items = isLoggedIn ? dbItems : cartStore.items.map((i) => ({
    variantId: i.variantId,
    productName: i.productName,
    variantName: i.variantName,
    price: i.price,
    quantity: i.quantity,
    image: i.image ?? "/logo.png",
  }));

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const hasItems = items.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasItems) { toast.error("Your cart is empty."); return; }

    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const res = await processCheckout({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      line1: fd.get("line1") as string,
      line2: (fd.get("line2") as string) || undefined,
      city: fd.get("city") as string,
      state: fd.get("state") as string,
      pincode: fd.get("pincode") as string,
      country: "India",
      // Pass guest items; server uses DB cart for logged-in users
      items: items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
        price: i.price,
        productName: i.productName,
        variantName: i.variantName,
      })),
    });

    if (res.success && res.orderData) {
      toast.success("Order saved! Opening WhatsApp…");
      if (!isLoggedIn) cartStore.clearCart();

      const order = res.orderData;
      const addr = order.shippingAddress as {
        name: string; phone: string; email: string;
        line1: string; line2?: string; city: string; state: string; pincode: string; country: string;
      };

      const productsList = order.items
        .map((i) => `• ${i.productName} ${i.variantName} × ${i.quantity} — ₹${(i.price * i.quantity).toLocaleString("en-IN")}`)
        .join("\n");

      const waText = encodeURIComponent(
        `Hello Vault Peptides,\n\nI would like to place an order.\n\n*Order ID:* ${order.orderNumber}\n\n*Customer:*\nName: ${addr.name}\nPhone: ${addr.phone}\nEmail: ${addr.email}\n\n*Ship to:*\n${addr.line1}${addr.line2 ? `, ${addr.line2}` : ""}\n${addr.city}, ${addr.state} – ${addr.pincode}, ${addr.country}\n\n*Items:*\n${productsList}\n\n*Total: ₹${order.totalAmount.toLocaleString("en-IN")}*\n\nPlease confirm. Thank you!`
      );

      // Use anchor click — more reliable than window.location.href for WhatsApp deep links
      const a = document.createElement("a");
      a.href = `https://wa.me/918722579999?text=${waText}`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      toast.error(res.error || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!hasItems) {
    return (
      <div className="text-center py-24 border border-dashed border-border rounded-2xl" style={{ backgroundColor: "#EDE1CE" }}>
        <ShoppingBag className="mx-auto h-12 w-12 text-primary/40 mb-4" />
        <h2 className="font-serif text-2xl font-light mb-2" style={{ color: "#1A0E05" }}>Your cart is empty</h2>
        <p className="font-sans text-sm mb-6" style={{ color: "#3D2510" }}>Add some products before checking out.</p>
        <Link href="/shop">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-sans text-xs tracking-widest h-11 px-8">
            BROWSE PRODUCTS
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
      {/* Shipping form */}
      <div className="lg:col-span-2">
        <div className="border border-border rounded-lg p-8" style={{ backgroundColor: "#EDE1CE" }}>
          <h2 className="font-serif text-xl font-medium mb-6" style={{ color: "#1A0E05" }}>Shipping Information</h2>
          <div className="grid gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" style={{ color: "#3D2510" }}>Full Name *</Label>
                <Input id="name" name="name" required placeholder="John Doe" className="h-11" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" style={{ color: "#3D2510" }}>Phone *</Label>
                <Input id="phone" name="phone" required placeholder="+91 98765 43210" className="h-11" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#3D2510" }}>Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" className="h-11" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="line1" style={{ color: "#3D2510" }}>Address Line 1 *</Label>
              <Input id="line1" name="line1" required placeholder="House / Flat no., Street" className="h-11" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="line2" style={{ color: "#3D2510" }}>Address Line 2 (optional)</Label>
              <Input id="line2" name="line2" placeholder="Landmark, Area" className="h-11" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" style={{ color: "#3D2510" }}>City *</Label>
                <Input id="city" name="city" required placeholder="Mumbai" className="h-11" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" style={{ color: "#3D2510" }}>State *</Label>
                <Input id="state" name="state" required placeholder="Maharashtra" className="h-11" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode" style={{ color: "#3D2510" }}>Pincode *</Label>
                <Input id="pincode" name="pincode" required placeholder="400001" className="h-11" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order summary */}
      <div className="lg:col-span-1">
        <div className="border border-border rounded-lg p-6 sticky top-24" style={{ backgroundColor: "#EDE1CE" }}>
          <h2 className="font-serif text-xl font-light mb-5" style={{ color: "#1A0E05" }}>Order Summary</h2>
          <div className="space-y-3 mb-5">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between gap-2 text-sm font-sans">
                <span style={{ color: "#3D2510" }}>
                  {item.productName} <span className="text-primary font-medium">{item.variantName}</span> ×{item.quantity}
                </span>
                <span className="font-semibold shrink-0" style={{ color: "#1A0E05" }}>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-sans font-bold text-base" style={{ color: "#1A0E05" }}>
              <span>Total</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="p-4 border border-primary/20 rounded-lg mb-5" style={{ backgroundColor: "rgba(107,53,32,0.06)" }}>
            <div className="flex items-start gap-3">
              <MessageCircle className="text-primary h-5 w-5 mt-0.5 shrink-0" />
              <p className="font-sans text-xs leading-relaxed" style={{ color: "#3D2510" }}>
                After placing, you&apos;ll be redirected to WhatsApp to confirm and receive payment instructions.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 font-sans tracking-wide rounded-none"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {loading ? "Processing…" : "Place Order via WhatsApp"}
          </Button>
        </div>
      </div>
    </form>
  );
}
