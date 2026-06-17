import Navbar from "@/components/layout/navbar";
import { COATrustSection } from "@/components/coa-trust-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purity Standards | Vault Peptides",
  description: "How Vault Peptides guarantees 99%+ purity on every batch using HPLC and Mass Spectrometry testing.",
};

export default function PurityPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero — solid bg */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-24 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-4">Strict Lab Testing</p>
            <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight mb-6" style={{ color: "#1A0E05" }}>
              99%+ <em>Purity Standard</em>
            </h1>
            <p className="font-sans leading-relaxed" style={{ color: "#3D2510" }}>
              When it comes to research, purity is everything. We prove it — batch by batch, with a Certificate of Analysis.
            </p>
          </div>
        </section>

        <section style={{ backgroundColor: "#F5EDE0" }} className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="space-y-6">
              {[
                {
                  title: "How We Test Our Products",
                  body: "We use advanced lab testing methods (HPLC and Mass Spectrometry) on every single batch. This high-tech testing guarantees our peptides have no cheap fillers, damaged molecules, or harmful leftovers from manufacturing. These machines allow us to see the exact makeup and weight of the powder in every vial, ensuring you get exactly the pure product you paid for.",
                  highlight: false,
                },
                {
                  title: "We Test Everything Twice",
                  body: "We do something most brands won't: we double-check every single batch. After receiving the product from our manufacturer, we test it again to make absolutely sure it is safe and pure. Currently, all our products are backed by rigorous Indian laboratory reports. We are elevating this standard by providing global Certificates of Analysis directly from Freedom Diagnostics in the United States — independently verifiable on their official platform, with photographs of the actual product vial.",
                  highlight: true,
                },
                {
                  title: "No Edited Reports. Ever.",
                  body: "Every Certificate of Analysis issued for a Vault Peptides product is genuine, unaltered, and directly accessible through the issuing laboratory's platform. We do not produce, alter, or generate our own test certificates. Complete chain-of-custody documentation is maintained for every batch.",
                  highlight: false,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-card border rounded-lg p-8"
                  style={{ borderColor: item.highlight ? "rgba(107,53,32,0.3)" : undefined }}
                >
                  <h2
                    className="font-serif text-2xl font-semibold mb-4"
                    style={{ color: item.highlight ? "#6B3520" : "#1A0E05" }}
                  >
                    {item.title}
                  </h2>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: "#3D2510" }}>{item.body}</p>
                </div>
              ))}
            </div>

            {process.env.NEXT_PUBLIC_SAMPLE_COA_URL && (
              <div className="mt-10 text-center">
                <a
                  href={process.env.NEXT_PUBLIC_SAMPLE_COA_URL}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 border px-8 h-12 rounded-none font-sans text-xs tracking-widest uppercase transition-colors hover:bg-primary/10"
                  style={{ borderColor: "#C8B89E", color: "#1A0E05" }}
                >
                  View a Sample Certificate of Analysis
                </a>
              </div>
            )}
          </div>
        </section>

        {/* COA Trust Section */}
        <COATrustSection />
      </main>
    </div>
  );
}
