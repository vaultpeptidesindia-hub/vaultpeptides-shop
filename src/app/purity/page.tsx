import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purity Standards | Vault Peptides",
  description: "How Vault Peptides guarantees 99%+ purity on every batch using HPLC and Mass Spectrometry testing.",
};

export default function PurityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-24 dot-pattern border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-4">Strict Lab Testing</p>
            <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight mb-6">
              99%+ <em>Purity Standard</em>
            </h1>
            <p className="font-sans text-foreground/60 leading-relaxed">
              When it comes to your body and your research, purity is everything. We prove it — batch by batch.
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="space-y-6">
            {[
              {
                title: "How We Test Our Products",
                body: "We use advanced lab testing methods (HPLC and Mass Spectrometry) on every single batch. This high-tech testing guarantees our peptides have no cheap fillers, damaged molecules, or harmful leftovers from manufacturing. These machines allow us to see the exact makeup and weight of the powder in every vial, ensuring you get exactly the pure product you paid for.",
              },
              {
                title: "We Test Everything Twice",
                color: true,
                body: "We do something most brands won't: we double-check every single batch. After receiving the product from our manufacturer, we test it again to make absolutely sure it is safe and pure. Currently, all our products are backed by rigorous Indian laboratory reports. Soon, we will elevate this standard by providing global Certificates of Analysis (COAs) directly from Freedom Diagnostics in the US. To guarantee absolute honesty, you will be able to search for our Freedom Diagnostics reports directly on their official website. Each report will even show a photo of our actual vial. No fakes. No edited photos. Just pure, honest results.",
              },
              {
                title: "Batch Verification",
                body: "Every product ships with a unique batch number printed on the vial. You can enter this batch number on our Verify Batch page to see the full test report, manufacturing date, and COA status for that specific batch.",
              },
            ].map((item) => (
              <div key={item.title} className={`bg-card border rounded-lg p-8 ${item.color ? "border-primary/30" : "border-border"}`}>
                <h2 className={`font-serif text-2xl font-semibold mb-4 ${item.color ? "text-primary" : ""}`}>{item.title}</h2>
                <p className="font-sans text-sm text-foreground/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
