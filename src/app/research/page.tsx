import Navbar from "@/components/layout/navbar";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Hub | Vault Peptides",
  description: "Learn about the science behind research peptides including Retatrutide, MOTS-c, GHK-Cu, Tesamorelin, and more.",
};

const ARTICLES = [
  { title: "What is Retatrutide?", slug: "retatrutide", sub: "GIP / GLP-1 / Glucagon Tri-Agonist", desc: "A triple receptor agonist under research for metabolic regulation and weight management." },
  { title: "What is MOTS-c?", slug: "mots-c", sub: "Mitochondria-Derived Peptide", desc: "A mitochondrial peptide researched for its role in energy metabolism and insulin sensitivity." },
  { title: "What is GHK-Cu?", slug: "ghk-cu", sub: "Copper Tripeptide", desc: "A naturally occurring copper peptide studied for wound healing and skin remodelling." },
  { title: "What is Tesamorelin?", slug: "tesamorelin", sub: "GHRH Analogue", desc: "A synthetic growth-hormone-releasing hormone analogue under research for body composition." },
  { title: "What is Semax?", slug: "semax", sub: "ACTH-Derived Neuropeptide", desc: "A neuroprotective peptide derived from ACTH, studied for cognitive and neurological effects." },
  { title: "What is Selank?", slug: "selank", sub: "Tuftsin Analogue", desc: "A synthetic heptapeptide investigated for anxiolytic and immunomodulatory properties." },
  { title: "What is Wolverine Blend?", slug: "wolverine-blend", sub: "Regenerative Stack", desc: "A proprietary peptide combination researched for accelerated tissue recovery." },
  { title: "What is Klow Blend?", slug: "klow-blend", sub: "Inflammation Modulation Stack", desc: "A research formulation targeting inflammation and joint-health pathways." },
  { title: "What is Glow Blend?", slug: "glow-blend", sub: "Skin Rejuvenation Stack", desc: "A peptide combination developed for skin rejuvenation and anti-ageing research." },
];

export default function ResearchPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1">
        {/* Hero — solid bg */}
        <section style={{ backgroundColor: "#F5EDE0" }} className="py-24 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-4">Knowledge Center</p>
            <h1 className="font-serif text-5xl font-light mb-6" style={{ color: "#1A0E05" }}>Research <em>Hub</em></h1>
            <p className="font-sans text-sm" style={{ color: "#3D2510" }}>
              Scientific overviews of the peptides and blends we carry. For educational and research purposes only.
            </p>
          </div>
        </section>

        <section style={{ backgroundColor: "#F5EDE0" }} className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ARTICLES.map((article) => (
                <Link
                  key={article.slug}
                  href={`/research/${article.slug}`}
                  className="group bg-card border border-border rounded-lg p-7 hover:shadow-sm hover:border-primary/30 transition-all"
                >
                  <p className="text-[10px] font-sans tracking-widest text-primary/60 uppercase mb-2">{article.sub}</p>
                  <h2 className="font-serif text-xl font-medium group-hover:text-primary transition-colors mb-3" style={{ color: "#1A0E05" }}>{article.title}</h2>
                  <p className="font-sans text-xs leading-relaxed mb-4" style={{ color: "#3D2510" }}>{article.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-sans text-primary font-medium">
                    Read more <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
