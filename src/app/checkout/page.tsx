// Server component — Navbar (async, server-only) must NOT be imported in "use client" files
import Navbar from "@/components/layout/navbar";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { COATrustSection } from "@/components/coa-trust-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Vault Peptides",
};

export default function CheckoutPage() {
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
          <CheckoutForm />
          <div className="mt-16">
            <COATrustSection compact />
          </div>
        </div>
      </main>
    </div>
  );
}
