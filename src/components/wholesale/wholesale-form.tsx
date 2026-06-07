"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitWholesaleInquiry } from "@/actions/wholesale";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const BUSINESS_TYPES = [
  "Research Institution", "Pharmaceutical Company", "Biotechnology Company",
  "Clinical Research Organization", "University / Academia", "Hospital / Medical Center",
  "Compounding Pharmacy", "Other",
];
const VOLUME_OPTIONS = [
  "< ₹50,000 / month", "₹50,000 – ₹2,00,000 / month",
  "₹2,00,000 – ₹10,00,000 / month", "> ₹10,00,000 / month",
];

export function WholesaleForm() {
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
      const res = await submitWholesaleInquiry({ companyName, contactName, phone, email, businessType, monthlyVolume, message });
      if (res.success) {
        setSubmitted(true);
      } else {
        toast.error(res.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not submit. Please WhatsApp us at +91 87225 79999.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-24">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary mb-6" />
        <h2 className="font-serif text-3xl font-light mb-4" style={{ color: "#1A0E05" }}>Inquiry Received!</h2>
        <p className="font-sans text-lg" style={{ color: "#3D2510" }}>
          Our wholesale team will contact you within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <h2 className="font-serif text-2xl font-light mb-6" style={{ color: "#1A0E05" }}>Wholesale Inquiry Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" style={{ color: "#3D2510" }}>Company Name *</Label>
            <Input id="companyName" name="companyName" required style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName" style={{ color: "#3D2510" }}>Contact Person *</Label>
            <Input id="contactName" name="contactName" required style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" style={{ color: "#3D2510" }}>Phone Number *</Label>
            <Input id="phone" name="phone" required style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: "#3D2510" }}>Email Address *</Label>
            <Input id="email" name="email" type="email" required style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessType" style={{ color: "#3D2510" }}>Business Type *</Label>
          <select id="businessType" name="businessType" required className="w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}>
            <option value="">Select business type…</option>
            {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyVolume" style={{ color: "#3D2510" }}>Estimated Monthly Volume *</Label>
          <select id="monthlyVolume" name="monthlyVolume" required className="w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}>
            <option value="">Select volume range…</option>
            {VOLUME_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message" style={{ color: "#3D2510" }}>Additional Message</Label>
          <Textarea id="message" name="message" rows={4} placeholder="Tell us about your requirements…"
            className="resize-none font-sans text-sm" style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 font-sans font-medium tracking-wide rounded-none">
          {loading ? "Submitting…" : "Submit Wholesale Inquiry"}
        </Button>
      </form>
    </div>
  );
}
