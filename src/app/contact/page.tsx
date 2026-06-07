// Server component — Navbar is server-only
import Navbar from "@/components/layout/navbar";
import { ContactForm } from "@/components/contact/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Vault Peptides",
  description: "Get in touch with Vault Peptides via WhatsApp or email. We reply within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1">
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-24 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-4">Get in Touch</p>
            <h1 className="font-serif text-5xl font-light mb-4" style={{ color: "#1A0E05" }}>Contact <em>Us</em></h1>
            <p className="font-sans text-sm" style={{ color: "#3D2510" }}>We reply within 24 hours on business days.</p>
          </div>
        </section>
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <ContactForm />
          </div>
        </section>
      </main>
    </div>
  );
}
