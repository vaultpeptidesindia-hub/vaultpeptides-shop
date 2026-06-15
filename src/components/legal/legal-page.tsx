import Navbar from "@/components/layout/navbar";
import type { ReactNode } from "react";

/** Shared, consistently-styled shell for all legal / policy pages. */
export function LegalPage({
  eyebrow = "Legal",
  title,
  updated,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#F5EDE0" }}>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-16 max-w-3xl">
        <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-3">{eyebrow}</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-3" style={{ color: "#1A0E05" }}>
          {title}
        </h1>
        <p className="font-sans text-xs text-muted-foreground mb-10">Last updated: {updated}</p>
        {intro && (
          <p className="font-sans text-sm leading-relaxed mb-10" style={{ color: "#3D2510" }}>
            {intro}
          </p>
        )}
        <div className="space-y-8">{children}</div>
      </main>
    </div>
  );
}

/** A titled section block for legal pages. */
export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-xl font-medium mb-3" style={{ color: "#1A0E05" }}>
        {title}
      </h2>
      <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3D2510" }}>
        {children}
      </div>
    </section>
  );
}
