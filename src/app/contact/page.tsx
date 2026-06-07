"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, CheckCircle2, Phone } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent! We'll reply within 24 hours.");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-24 dot-pattern border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-4">Get in Touch</p>
            <h1 className="font-serif text-5xl font-light mb-4 text-foreground">Contact <em>Us</em></h1>
            <p className="font-sans text-sm text-foreground/65">We reply within 24 hours on business days.</p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-medium mb-6 text-foreground">Reach Us Directly</h2>
                <div className="space-y-4">
                  <a
                    href="https://wa.me/918722579999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-[#25D366]/10 rounded-full flex items-center justify-center shrink-0">
                      <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        WhatsApp
                      </div>
                      <div className="font-sans text-sm text-foreground/65 mt-0.5">+91 87225 79999</div>
                    </div>
                  </a>

                  <a
                    href="mailto:info@vaultpeptides.in"
                    className="flex items-center gap-4 p-5 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        Email
                      </div>
                      <div className="font-sans text-sm text-foreground/65 mt-0.5">info@vaultpeptides.in</div>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-sm text-foreground">Phone</div>
                      <div className="font-sans text-sm text-foreground/65 mt-0.5">+91 87225 79999</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <p className="font-sans text-xs text-foreground/60 italic leading-relaxed">
                  Vault Peptides products are for laboratory research use only. We do not provide medical advice.
                  For product inquiries, order support, or COA requests, use the form or contact us directly via WhatsApp.
                </p>
              </div>
            </div>

            {/* Form */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-serif text-2xl font-medium mb-2 text-foreground">Message Received</h3>
                <p className="font-sans text-sm text-foreground/65">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-sans text-xs tracking-widest uppercase text-foreground/70">Name</Label>
                  <Input
                    required
                    placeholder="John Doe"
                    className="bg-background border-border h-12 rounded-none font-sans text-sm text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-xs tracking-widest uppercase text-foreground/70">Email</Label>
                  <Input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="bg-background border-border h-12 rounded-none font-sans text-sm text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-xs tracking-widest uppercase text-foreground/70">Message</Label>
                  <Textarea
                    required
                    rows={5}
                    placeholder="How can we help?"
                    className="bg-background border-border rounded-none font-sans text-sm text-foreground resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-none font-sans text-xs tracking-widest"
                >
                  {loading ? "SENDING…" : "SEND MESSAGE"}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
