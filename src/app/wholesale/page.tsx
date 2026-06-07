"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    try {
      const res = await submitWholesaleInquiry({
        companyName: fd.get("companyName") as string,
        contactName: fd.get("contactName") as string,
        phone: fd.get("phone") as string,
        email: fd.get("email") as string,
        businessType: fd.get("businessType") as string,
        monthlyVolume: fd.get("monthlyVolume") as string,
        message: fd.get("message") as string,
      });
      if (res.success) {
        setSubmitted(true);
      } else {
        toast.error(res.error || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Failed to submit. Please contact us via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 dot-pattern border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="text-primary h-8 w-8" />
              <span className="text-sm font-sans font-medium text-primary uppercase tracking-widest">
                B2B & Wholesale
              </span>
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl font-light tracking-tight mb-6 text-foreground">
              Partner with <em>Vault Peptides</em>
            </h1>
            <p className="font-sans text-lg text-foreground/65 max-w-2xl leading-relaxed">
              Access bulk pricing, dedicated account management, and priority allocation for research institutions,
              pharma companies, and distributors.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 border-b border-border bg-card/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Volume Discounts",
                  desc: "Tiered pricing starting from 20% off for orders above ₹50,000.",
                },
                {
                  title: "Priority Stock",
                  desc: "Guaranteed allocation from every production batch for verified partners.",
                },
                {
                  title: "Dedicated Support",
                  desc: "A dedicated account manager and expedited COA delivery for your team.",
                },
              ].map((b) => (
                <div key={b.title} className="flex gap-3">
                  <CheckCircle2 className="text-primary h-5 w-5 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-sans font-semibold mb-1 text-foreground">{b.title}</h3>
                    <p className="font-sans text-sm text-foreground/65">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-24 container mx-auto px-4 lg:px-8 max-w-3xl">
          {submitted ? (
            <div className="text-center py-24">
              <CheckCircle2 className="mx-auto h-16 w-16 text-primary mb-6" />
              <h2 className="font-serif text-3xl font-light mb-4 text-foreground">Inquiry Received!</h2>
              <p className="font-sans text-foreground/65 text-lg">
                Our wholesale team will contact you within 1 business day.
              </p>
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-serif text-2xl font-light text-foreground">
                  Wholesale Inquiry Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-foreground/80">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        required
                        className="bg-background text-foreground border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-foreground/80">Contact Person *</Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        required
                        className="bg-background text-foreground border-border"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground/80">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        required
                        className="bg-background text-foreground border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground/80">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="bg-background text-foreground border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-foreground/80">Business Type *</Label>
                    <select
                      id="businessType"
                      name="businessType"
                      required
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select business type…</option>
                      {BUSINESS_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyVolume" className="text-foreground/80">Estimated Monthly Volume *</Label>
                    <select
                      id="monthlyVolume"
                      name="monthlyVolume"
                      required
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select volume range…</option>
                      {VOLUME_OPTIONS.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground/80">Additional Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us about your requirements, specific compounds needed, etc."
                      className="bg-background text-foreground border-border resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base font-sans font-medium tracking-wide"
                  >
                    {loading ? "Submitting…" : "Submit Wholesale Inquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
