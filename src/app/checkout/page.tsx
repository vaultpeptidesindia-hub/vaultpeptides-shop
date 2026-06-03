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

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const cartStore = useCart();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      line1: formData.get("line1") as string,
      line2: formData.get("line2") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      country: "India",
    };

    const res = await processCheckout(data);

    if (res.success) {
      toast.success("Order placed successfully! Redirecting to WhatsApp...");
      cartStore.clearCart();
      
      // Generate WhatsApp message
      const order = res.orderData as {
        orderNumber: string;
        shippingAddress: unknown;
        items: Array<{
          product: { name: string };
          quantity: number;
          price: number;
        }>;
        totalAmount: number;
      };
      const addr = order.shippingAddress as {
        name: string;
        phone: string;
        email: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
      };
      const productsList = order.items.map((item) => 
        `- ${item.product.name} x ${item.quantity} (₹${item.price * item.quantity})`
      ).join("\n");

      const message = `Hello Vault Peptides,

I would like to place an order.

Order ID: ${order.orderNumber}

Customer Details:
Name: ${addr.name}
Phone: ${addr.phone}
Email: ${addr.email}

Shipping Address:
${addr.line1}${addr.line2 ? `, ${addr.line2}` : ""}
${addr.city}, ${addr.state} - ${addr.pincode}
${addr.country}

Products:
${productsList}

Total: ₹${order.totalAmount.toFixed(2)}

Please confirm my order.`;

      const encodedMessage = encodeURIComponent(message);
      window.location.href = `https://wa.me/918722579999?text=${encodedMessage}`;
    } else {
      toast.error(res.error || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" required className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" required className="bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" required className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input id="line1" name="line1" required className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                  <Input id="line2" name="line2" className="bg-background" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" required className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" name="pincode" required className="bg-background" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-28">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border border-primary/30 rounded-xl bg-primary/5 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-4 border-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">WhatsApp Confirmation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You will be redirected to WhatsApp to confirm your order details and receive payment instructions.
                    </p>
                  </div>
                </div>
                <Separator className="my-6 bg-border" />
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground italic">Note: Orders are processed manually after confirmation on WhatsApp.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg">
                  {loading ? "Processing..." : "Place Order on WhatsApp"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
}
