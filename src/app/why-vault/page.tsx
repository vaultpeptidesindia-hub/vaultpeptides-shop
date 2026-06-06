import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ShieldCheck, FlaskConical, Search, Award, Microscope, Leaf } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Vault Peptides | Quality, Purity & Trust",
  description: "Learn why Vault Peptides is India's most trusted research peptide supplier. HPLC tested, COA backed, double-verified.",
};

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "99%+ Purity Guarantee",
    body: "Every single batch we release is HPLC and Mass Spectrometry tested to confirm purity above 99%. No exceptions, no shortcuts.",
  },
  {
    icon: FlaskConical,
    title: "Double Testing Protocol",
    body: "We test once at the manufacturer, and test again independently upon receipt. Two separate labs, two separate reports, one standard: perfect.",
  },
  {
    icon: Search,
    title: "Full Batch Transparency",
    body: "Every product ships with a traceable batch number. Customers can verify their batch independently on our platform.",
  },
  {
    icon: Award,
    title: "COA on Request",
    body: "Certificates of Analysis are available for every batch. Request one directly from any product page and receive it within 24 hours.",
  },
  {
    icon: Microscope,
    title: "Research Grade Standards",
    body: "Our compounds meet international research-grade manufacturing standards. Produced in ISO-compliant facilities only.",
  },
  {
    icon: Leaf,
    title: "No Fillers, No Compromises",
    body: "What's on the label is what's in the vial. No fillers, no cutting agents, no hidden excipients.",
  },
];

export default function WhyVaultPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 dot-pattern border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-4">Our Philosophy</p>
            <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight mb-6">
              Why <em>Vault Peptides?</em>
            </h1>
            <p className="font-sans text-foreground/60 leading-relaxed">
              In a market full of inconsistency, we built Vault Peptides on a single principle: you deserve to know exactly what you&apos;re getting. Full transparency, verified purity, every time.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-24 container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((p) => (
              <div key={p.title} className="bg-card border border-border rounded-lg p-8 hover:shadow-sm transition-shadow">
                <p.icon className="h-6 w-6 text-primary mb-5" />
                <h3 className="font-serif text-xl font-semibold mb-3">{p.title}</h3>
                <p className="font-sans text-sm text-foreground/60 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="py-20 bg-card/50 border-y border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
            <p className="font-serif text-2xl md:text-3xl font-light italic text-foreground leading-relaxed">
              &ldquo;No fakes. No edited photos. Just pure, honest results — directly verifiable by you.&rdquo;
            </p>
            <p className="font-sans text-xs tracking-widest text-muted-foreground uppercase mt-6">— Vault Peptides Promise</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
