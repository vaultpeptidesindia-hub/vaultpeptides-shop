// Server component — no "use client" here, Navbar requires server context
import Navbar from "@/components/layout/navbar";
import { WholesaleForm } from "@/components/wholesale/wholesale-form";
import { Building2, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale & B2B | Vault Peptides",
  description: "Partner with Vault Peptides for bulk pricing, dedicated account management, and priority stock allocation.",
};

export default function WholesalePage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-24 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="text-primary h-8 w-8" />
              <span className="text-sm font-sans font-medium text-primary uppercase tracking-widest">B2B & Wholesale</span>
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-6" style={{ color: "#1A0E05" }}>
              Partner with <em>Vault Peptides</em>
            </h1>
            <p className="font-sans text-lg max-w-2xl leading-relaxed" style={{ color: "#3D2510" }}>
              Access bulk pricing, dedicated account management, and priority allocation for research institutions,
              pharma companies, and distributors.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section style={{ backgroundColor: "#EDE1CE" }} className="py-16 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Volume Discounts", desc: "Tiered pricing starting from 20% off for orders above ₹50,000." },
                { title: "Priority Stock", desc: "Guaranteed allocation from every production batch for verified partners." },
                { title: "Dedicated Support", desc: "A dedicated account manager and expedited COA delivery for your team." },
              ].map((b) => (
                <div key={b.title} className="flex gap-3">
                  <CheckCircle2 className="text-primary h-5 w-5 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-sans font-semibold mb-1" style={{ color: "#1A0E05" }}>{b.title}</h3>
                    <p className="font-sans text-sm" style={{ color: "#3D2510" }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form — client component, isolated */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <WholesaleForm />
          </div>
        </section>
      </main>
    </div>
  );
}
