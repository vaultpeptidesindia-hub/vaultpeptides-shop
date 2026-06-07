"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitWholesaleInquiry } from "@/actions/wholesale";
import { toast } from "sonner";
import { Building2, CheckCircle2 } from "lucide-react";

const BUSINESS_TYPES = [
  "Research Institution",
  "Pharmaceutical Company",
  "Biotechnology Company",
  "Clinical Research Organization",
  "University / Academia",
  "Hospital / Medical Center",
  "Compounding Pharmacy",
  "Other",
];

const VOLUME_OPTIONS = [
  "< ₹50,000 / month",
  "₹50,000 – ₹2,00,000 / month",
  "₹2,00,000 – ₹10,00,000 / month",
  "> ₹10,00,000 / month",
];

export default function WholesalePage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const companyName = fd.get("companyName") as string;
    const contactName = fd.get("contactName") as string;
    const phone = fd.get("phone") as string;
    const email = fd.get("email") as string;
    const businessType = fd.get("businessType") as string;
    const monthlyVolume = fd.get("monthlyVolume") as string;
    const message = (fd.get("message") as string) || "";

    if (!companyName || !contactName || !phone || !email || !businessType || !monthlyVolume) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await submitWholesaleInquiry({
        companyName,
        contactName,
        phone,
        email,
        businessType,
        monthlyVolume,
        message,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        toast.error(res.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Wholesale submit error:", err);
      toast.error("Could not submit. Please WhatsApp us at +91 87225 79999.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero — solid bg */}
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

        {/* Form */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            {submitted ? (
              <div className="text-center py-24">
                <CheckCircle2 className="mx-auto h-16 w-16 text-primary mb-6" />
                <h2 className="font-serif text-3xl font-light mb-4" style={{ color: "#1A0E05" }}>Inquiry Received!</h2>
                <p className="font-sans text-lg" style={{ color: "#3D2510" }}>
                  Our wholesale team will contact you within 1 business day.
                </p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="font-serif text-2xl font-light mb-6" style={{ color: "#1A0E05" }}>Wholesale Inquiry Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="font-sans text-xs uppercase tracking-widest" style={{ color: "#3D2510" }}>Company Name *</Label>
                      <Input id="companyName" name="companyName" required style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="font-sans text-xs uppercase tracking-widest" style={{ color: "#3D2510" }}>Contact Person *</Label>
                      <Input id="contactName" name="contactName" required style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-sans text-xs uppercase tracking-widest" style={{ color: "#3D2510" }}>Phone Number *</Label>
                      <Input id="phone" name="phone" required style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-sans text-xs uppercase tracking-widest" style={{ color: "#3D2510" }}>Email Address *</Label>
                      <Input id="email" name="email" type="email" required style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="font-sans text-xs uppercase tracking-widest" style={{ color: "#3D2510" }}>Business Type *</Label>
                    <select
                      id="businessType"
                      name="businessType"
                      required
                      className="w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}
                    >
                      <option value="">Select business type…</option>
                      {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyVolume" className="font-sans text-xs uppercase tracking-widest" style={{ color: "#3D2510" }}>Estimated Monthly Volume *</Label>
                    <select
                      id="monthlyVolume"
                      name="monthlyVolume"
                      required
                      className="w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}
                    >
                      <option value="">Select volume range…</option>
                      {VOLUME_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-sans text-xs uppercase tracking-widest" style={{ color: "#3D2510" }}>Additional Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us about your requirements, specific compounds needed, etc."
                      className="resize-none font-sans text-sm"
                      style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 font-sans font-medium tracking-wide"
                  >
                    {loading ? "Submitting…" : "Submit Wholesale Inquiry"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
