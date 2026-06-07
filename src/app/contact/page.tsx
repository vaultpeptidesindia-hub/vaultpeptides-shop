"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, CheckCircle2, Phone } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const whatsappText = encodeURIComponent(
    `Hello Vault Peptides,\n\nName: ${name}\nEmail: ${email}\n\nMessage: ${message}`
  );
  const whatsappUrl = `https://wa.me/918722579999?text=${whatsappText}`;
  const canSend = name.trim().length > 0 && message.trim().length > 0;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-24 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-4">Get in Touch</p>
            <h1 className="font-serif text-5xl font-light mb-4" style={{ color: "#1A0E05" }}>Contact <em>Us</em></h1>
            <p className="font-sans text-sm" style={{ color: "#3D2510" }}>We reply within 24 hours on business days.</p>
          </div>
        </section>

        <section style={{ backgroundColor: "#F5EDE0" }} className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12">

              {/* Contact info */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-medium" style={{ color: "#1A0E05" }}>Reach Us Directly</h2>

                <a
                  href="https://wa.me/918722579999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(37,211,102,0.15)" }}>
                    <MessageCircle className="h-5 w-5" style={{ color: "#25D366" }} />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-sm group-hover:text-primary transition-colors" style={{ color: "#1A0E05" }}>WhatsApp</div>
                    <div className="font-sans text-sm mt-0.5" style={{ color: "#3D2510" }}>+91 87225 79999</div>
                  </div>
                </a>

                <a
                  href="mailto:info@vaultpeptides.in"
                  className="flex items-center gap-4 p-5 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(107,53,32,0.1)" }}>
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-sm group-hover:text-primary transition-colors" style={{ color: "#1A0E05" }}>Email</div>
                    <div className="font-sans text-sm mt-0.5" style={{ color: "#3D2510" }}>info@vaultpeptides.in</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-lg">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(107,53,32,0.1)" }}>
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-sm" style={{ color: "#1A0E05" }}>Phone</div>
                    <div className="font-sans text-sm mt-0.5" style={{ color: "#3D2510" }}>+91 87225 79999</div>
                  </div>
                </div>

                <div className="p-5 bg-card border border-border rounded-lg">
                  <p className="font-sans text-xs italic leading-relaxed" style={{ color: "#6B5A42" }}>
                    Vault Peptides products are for laboratory research use only. For product inquiries,
                    order support, or COA requests, message us directly via WhatsApp.
                  </p>
                </div>
              </div>

              {/* Form */}
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-serif text-2xl font-medium mb-2" style={{ color: "#1A0E05" }}>Message Sent!</h3>
                  <p className="font-sans text-sm" style={{ color: "#3D2510" }}>
                    Your message was opened in WhatsApp. We&apos;ll get back to you shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <h2 className="font-serif text-2xl font-medium" style={{ color: "#1A0E05" }}>Send a Message</h2>

                  <div className="space-y-2">
                    <Label className="font-sans text-xs tracking-widest uppercase" style={{ color: "#3D2510" }}>Name *</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="h-12 rounded-none font-sans text-sm"
                      style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans text-xs tracking-widest uppercase" style={{ color: "#3D2510" }}>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-12 rounded-none font-sans text-sm"
                      style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans text-xs tracking-widest uppercase" style={{ color: "#3D2510" }}>Message *</Label>
                    <Textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help?"
                      className="rounded-none font-sans text-sm resize-none"
                      style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}
                    />
                  </div>

                  {/* Real <a> tag — never blocked by popup blockers */}
                  <a
                    href={canSend ? whatsappUrl : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { if (canSend) setSubmitted(true); }}
                    aria-disabled={!canSend}
                    className={`flex items-center justify-center gap-2 w-full h-12 font-sans text-xs tracking-widest font-medium text-white transition-opacity
                      ${canSend ? "opacity-100 cursor-pointer" : "opacity-40 cursor-not-allowed pointer-events-none"}`}
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    SEND VIA WHATSAPP
                  </a>

                  <p className="font-sans text-xs text-center" style={{ color: "#6B5A42" }}>
                    This opens WhatsApp with your message pre-filled. Fill in Name and Message to enable.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
