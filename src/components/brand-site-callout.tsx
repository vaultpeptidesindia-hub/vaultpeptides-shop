import { ArrowUpRight } from "lucide-react";

/**
 * Cross-links to the main brand site (vaultpeptides.in). The .in site is the
 * primary brand/marketing destination; this store (.shop) funnels visitors there
 * for fuller brand + product information.
 */
export function BrandSiteCallout({ className = "" }: { className?: string }) {
  return (
    <section className={className} style={{ backgroundColor: "#EDE1CE" }}>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <a
          href="https://vaultpeptides.in"
          target="_blank"
          rel="noopener"
          className="group flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center"
        >
          <span className="font-sans text-sm md:text-base" style={{ color: "#3D2510" }}>
            Check out{" "}
            <span className="font-semibold underline underline-offset-4 text-primary group-hover:text-primary/80 transition-colors">
              vaultpeptides.in
            </span>{" "}
            for more information on the brand and the products.
          </span>
          <ArrowUpRight className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}
