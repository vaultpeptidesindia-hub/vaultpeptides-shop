"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { processCheckout } from "@/actions/checkout";
import { toast } from "sonner";
import { useCart } from "@/store/use-cart";
import Footer from "@/components/layout/footer";
import { MessageCircle } from "lucide-react";

export default function CheckoutPage() {
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
      line2: formData.get("line2") as string || undefined,
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

      const message = `Hello Vault Peptides,

I would like to place an order.

*Order ID:* ${order.orderNumber}

*Customer Details:*
Name: ${addr.name}
Phone: ${addr.phone}
Email: ${addr.email}

*Shipping Address:*
${addr.line1}${addr.line2 ? `, ${addr.line2}` : ""}
${addr.city}, ${addr.state} – ${addr.pincode}
${addr.country}

*Products:*
${productsList}

*Order Total: ₹${order.totalAmount.toFixed(2)}*

Please confirm my order. Thank you.`;

      window.location.href = `https://wa.me/918722579999?text=${encodeURIComponent(message)}`;
    } else {
      toast.error(res.error || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mb-8">Fill in your details and we&apos;ll confirm your order via WhatsApp.</p>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
          {/* Shipping form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" required placeholder="John Doe" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" required placeholder="+91 98765 43210" className="bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" required placeholder="you@example.com" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1 *</Label>
                  <Input id="line1" name="line1" required placeholder="House / Flat no., Street" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2</Label>
                  <Input id="line2" name="line2" placeholder="Landmark, Area (optional)" className="bg-background" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" required placeholder="Mumbai" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" name="state" required placeholder="Maharashtra" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" name="pincode" required placeholder="400001" className="bg-background" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-28">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartStore.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                ) : (
                  cartStore.items.map((item) => (
                    <div key={item.variantId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.productName} <span className="text-primary">{item.variantName}</span> × {item.quantity}
                      </span>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                )}
                <Separator className="bg-border" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{subtotal.toFixed(2)}</span>
                </div>
                <Separator className="bg-border" />
                <div className="p-4 border border-primary/30 rounded-xl bg-primary/5 flex items-start gap-3">
                  <MessageCircle className="text-primary h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">WhatsApp Confirmation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      After placing, you&apos;ll be redirected to WhatsApp to confirm and receive payment instructions.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={loading || cartStore.items.length === 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg"
                >
                  {loading ? "Processing…" : "Place Order via WhatsApp"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
