import Navbar from "@/components/layout/navbar";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { COATrustSection } from "@/components/coa-trust-section";
import { auth } from "@/auth";
import { getCart } from "@/actions/cart";
import { getDefaultAddress } from "@/actions/addresses";
import { firstImage } from "@/lib/images";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout | Vault Peptides" };

export default async function CheckoutPage() {
  const [session, dbCart, savedAddress] = await Promise.all([auth(), getCart(), getDefaultAddress()]);
  const isLoggedIn = !!session?.user?.id;

  // Serialise DB cart items for the client component
  const dbItems = (dbCart?.items ?? []).map((item) => ({
    variantId: item.variantId,
    productName: item.variant?.product?.name ?? "",
    variantName: item.variant?.name ?? "",
    price: item.variant?.price ?? 0,
    quantity: item.quantity,
    image: firstImage(item.variant?.product?.images),
  }));

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1" style={{ backgroundColor: "#F5EDE0" }}>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <p className="font-sans text-[10px] tracking-[0.25em] text-primary/70 uppercase mb-2">Secure Order</p>
          <h1 className="font-serif text-4xl font-light mb-2" style={{ color: "#1A0E05" }}>Checkout</h1>
          <p className="font-sans text-sm mb-10" style={{ color: "#3D2510" }}>
            Fill in your details and confirm your order via WhatsApp.
          </p>
          <CheckoutForm isLoggedIn={isLoggedIn} dbItems={dbItems} savedAddress={savedAddress} />
          <div className="mt-16">
            <COATrustSection compact />
          </div>
        </div>
      </main>
    </div>
  );
}
