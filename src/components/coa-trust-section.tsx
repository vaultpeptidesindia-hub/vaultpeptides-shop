import { ShieldCheck, Search, Camera, FileCheck2, Globe, BadgeCheck } from "lucide-react";

interface COATrustSectionProps {
  compact?: boolean;
}

export function COATrustSection({ compact = false }: COATrustSectionProps) {
  return (
    <section className={`${compact ? "py-12" : "py-20"} bg-foreground text-background`}>
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-background/10 border border-background/20 rounded-full px-4 py-1.5 mb-6">
            <BadgeCheck className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-background/80">
              Quality Assurance Commitment
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-background mb-4 leading-tight">
            Verified Purity. <em>Proven Transparency.</em>
          </h2>
          <p className="font-sans text-sm text-background/70 max-w-3xl mx-auto leading-relaxed">
            All our products are currently backed by rigorous Indian laboratory reports. We are elevating this standard
            by partnering with <strong className="text-background font-semibold">Freedom Diagnostics, USA</strong> —
            a globally recognised third-party testing authority — to provide internationally verified Certificates of Analysis for every product.
          </p>
        </div>

        {/* Main trust card */}
        <div className="bg-background/10 border border-background/20 rounded-2xl p-8 md:p-10 mb-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-6 w-6 text-amber-400 shrink-0" />
                <h3 className="font-serif text-xl font-semibold text-background">
                  Coming Soon: Global COA Standard
                </h3>
              </div>
              <p className="font-sans text-sm text-background/75 leading-relaxed mb-6">
                Our upcoming COAs from Freedom Diagnostics (United States) will be independently verifiable
                directly on their official platform. Each report will include a photograph of the actual product vial tested —
                not stock images, not edited documents. Complete transparency, every single time.
              </p>
              <div className="space-y-3">
                {[
                  "No edited reports — ever",
                  "No stock images — actual vial photographs",
                  "Independently verifiable on Freedom Diagnostics' platform",
                  "Complete chain-of-custody documentation",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-background/80">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust pillars */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: FileCheck2,
                  title: "Certified Reports",
                  desc: "Every batch has a signed COA from an accredited laboratory.",
                },
                {
                  icon: Search,
                  title: "Independently Verifiable",
                  desc: "Search our reports directly on the Freedom Diagnostics platform.",
                },
                {
                  icon: Camera,
                  title: "Actual Vial Photos",
                  desc: "Real photographs of your exact product vial — no stock substitutes.",
                },
                {
                  icon: ShieldCheck,
                  title: "Genuine Third-Party",
                  desc: "Freedom Diagnostics operates independently — no conflicts of interest.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-background/10 border border-background/15 rounded-xl p-5 hover:bg-background/15 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-amber-400 mb-3" />
                  <h4 className="font-sans text-xs font-semibold text-background mb-1.5 tracking-wide">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs text-background/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current standard note */}
        <div className="flex items-start gap-4 bg-background/5 border border-background/10 rounded-xl px-6 py-5">
          <BadgeCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-background/70 leading-relaxed">
            <strong className="text-background font-semibold">Currently Active:</strong> All Vault Peptides products
            ship with Indian laboratory COAs confirming ≥99% purity via HPLC and Mass Spectrometry. Global Freedom
            Diagnostics COA integration launching soon — subscribe to our newsletter to be notified.
          </p>
        </div>
      </div>
    </section>
  );
}
