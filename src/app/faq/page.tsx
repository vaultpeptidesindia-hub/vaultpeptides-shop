import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Vault Peptides — research use, purity, COA, ordering, payment, shipping, and storage.",
  alternates: { canonical: "/faq" },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "What are research peptides?",
    a: "Research peptides are short chains of amino acids supplied for in-vitro laboratory research and development. Vault Peptides products are intended strictly for research use and are not for human or animal consumption.",
  },
  {
    q: "Are Vault Peptides products safe to consume?",
    a: "No. All products are sold strictly for laboratory research use only. They are not drugs, foods, or supplements, and are not for human or animal consumption.",
  },
  {
    q: "How do you ensure purity?",
    a: "Every batch is tested using HPLC and Mass Spectrometry for 99%+ purity. We re-test products after receiving them from the manufacturer to confirm purity and identity.",
  },
  {
    q: "Can I get a Certificate of Analysis (COA)?",
    a: "Yes. A COA is available on request for our products. Tap “Request COA” on any product page and you'll be connected to us on WhatsApp to receive it.",
  },
  {
    q: "How do I place an order?",
    a: "Add products to your cart and check out. After you submit your details, your full order is drafted into a WhatsApp message to our team for confirmation and payment instructions.",
  },
  {
    q: "How is payment handled?",
    a: "Order and payment details are confirmed directly with our team over WhatsApp after you place your order.",
  },
  {
    q: "Where do you ship and how long does it take?",
    a: "We ship across India. Orders are usually processed within 1–3 business days and delivered within 3–7 business days, depending on location. See our Shipping Policy for details.",
  },
  {
    q: "What is your return policy?",
    a: "For research-material integrity, shipped products are generally non-returnable, except for items that arrive damaged, defective, or incorrect — report these within 48 hours of delivery. See our Refund & Cancellation Policy.",
  },
  {
    q: "How should products be stored?",
    a: "Store research compounds according to good laboratory practice and the guidance provided for each product, typically cool and away from light. Handling and storage are the responsibility of the qualified researcher.",
  },
  {
    q: "How can I contact Vault Peptides?",
    a: "You can reach us on WhatsApp at +91 87225 79999 or through our contact page. We're happy to help with product, COA, and order questions.",
  },
];

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <JsonLd data={faqSchema} />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-16 max-w-3xl">
        <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-3">Support</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-3" style={{ color: "#1A0E05" }}>
          Frequently Asked Questions
        </h1>
        <p className="font-sans text-sm text-muted-foreground mb-12">
          Everything you need to know about ordering research peptides from Vault Peptides.
        </p>

        <div className="space-y-8">
          {FAQS.map((f) => (
            <div key={f.q} className="border-b border-border pb-6">
              <h2 className="font-serif text-lg font-medium mb-2" style={{ color: "#1A0E05" }}>
                {f.q}
              </h2>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "#3D2510" }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
