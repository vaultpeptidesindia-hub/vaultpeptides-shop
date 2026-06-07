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

export function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const cartStore = useCart();
  const subtotal = cartStore.totalPrice();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartStore.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const res = await processCheckout({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      line1: formData.get("line1") as string,
      line2: (formData.get("line2") as string) || undefined,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      country: "India",
      items: cartStore.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        productName: item.productName,
        variantName: item.variantName,
      })),
    });

    if (res.success && res.orderData) {
      toast.success("Order saved! Redirecting to WhatsApp…");
      cartStore.clearCart();
      const order = res.orderData;
      const addr = order.shippingAddress as {
        name: string; phone: string; email: string;
        line1: string; line2?: string; city: string; state: string; pincode: string; country: string;
      };
      const productsList = order.items
        .map((item) => `• ${item.productName} ${item.variantName} × ${item.quantity} — ₹${(item.price * item.quantity).toFixed(2)}`)
        .join("\n");
      const message = `Hello Vault Peptides,\n\nI would like to place an order.\n\n*Order ID:* ${order.orderNumber}\n\n*Customer Details:*\nName: ${addr.name}\nPhone: ${addr.phone}\nEmail: ${addr.email}\n\n*Shipping Address:*\n${addr.line1}${addr.line2 ? `, ${addr.line2}` : ""}\n${addr.city}, ${addr.state} – ${addr.pincode}\n${addr.country}\n\n*Products:*\n${productsList}\n\n*Order Total: ₹${order.totalAmount.toFixed(2)}*\n\nPlease confirm my order. Thank you.`;
      window.location.href = `https://wa.me/918722579999?text=${encodeURIComponent(message)}`;
    } else {
      toast.error(res.error || "Something went wrong.");
      setLoading(false);
    }
  };

  if (cartStore.items.length === 0) {
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
      <div className="lg:col-span-2 space-y-6">
        <div className="border border-border rounded-lg p-8" style={{ backgroundColor: "#EDE1CE" }}>
          <h2 className="font-serif text-xl font-medium mb-6" style={{ color: "#1A0E05" }}>Shipping Information</h2>
          <div className="grid gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" style={{ color: "#3D2510" }}>Full Name *</Label>
                <Input id="name" name="name" required placeholder="John Doe" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" style={{ color: "#3D2510" }}>Phone Number *</Label>
                <Input id="phone" name="phone" required placeholder="+91 98765 43210" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#3D2510" }}>Email Address *</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="line1" style={{ color: "#3D2510" }}>Address Line 1 *</Label>
              <Input id="line1" name="line1" required placeholder="House / Flat no., Street" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="line2" style={{ color: "#3D2510" }}>Address Line 2 (optional)</Label>
              <Input id="line2" name="line2" placeholder="Landmark, Area" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" style={{ color: "#3D2510" }}>City *</Label>
                <Input id="city" name="city" required placeholder="Mumbai" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" style={{ color: "#3D2510" }}>State *</Label>
                <Input id="state" name="state" required placeholder="Maharashtra" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode" style={{ color: "#3D2510" }}>Pincode *</Label>
                <Input id="pincode" name="pincode" required placeholder="400001" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
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
            {cartStore.items.map((item) => (
              <div key={item.variantId} className="flex justify-between text-sm font-sans" style={{ color: "#3D2510" }}>
                <span>
                  {item.productName} <span className="text-primary">{item.variantName}</span> × {item.quantity}
                </span>
                <span className="font-medium ml-2 shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-sans font-semibold" style={{ color: "#1A0E05" }}>
              <span>Total</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="p-4 border border-primary/30 rounded-lg mb-5" style={{ backgroundColor: "rgba(107,53,32,0.05)" }}>
            <div className="flex items-start gap-3">
              <MessageCircle className="text-primary h-5 w-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-sans font-semibold text-sm" style={{ color: "#1A0E05" }}>WhatsApp Confirmation</p>
                <p className="font-sans text-xs mt-1" style={{ color: "#3D2510" }}>
                  After placing, you&apos;ll be redirected to WhatsApp to confirm and receive payment instructions.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 font-sans text-sm tracking-wide rounded-none"
          >
            {loading ? "Processing…" : "Place Order via WhatsApp"}
          </Button>
        </div>
      </div>
    </form>
  );
}
