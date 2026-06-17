"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "vp-research-acknowledged";

/**
 * Age + research-use gate shown on first visit. Doubles as a compliance signal:
 * states 21+, research/analytical use only, intended buyers, and not-for-consumption.
 * Acknowledgement is stored in localStorage so it shows once.
 */
export function AgeGate() {
  const [ack, setAck] = useState<boolean | null>(null); // null = not yet read

  useEffect(() => {
    let acknowledged = false;
    try {
      acknowledged = localStorage.getItem(STORAGE_KEY) === "yes";
    } catch {
      acknowledged = true; // if storage is blocked, don't hard-block the site
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAck(acknowledged);
  }, []);

  const confirm = () => {
    try { localStorage.setItem(STORAGE_KEY, "yes"); } catch {}
    setAck(true);
  };

  const leave = () => {
    window.location.href = "https://www.google.com";
  };

  // Until read (SSR/first paint) or already acknowledged → render nothing.
  if (ack === null || ack === true) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(20,12,5,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border shadow-2xl p-8 md:p-10"
        style={{ backgroundColor: "#F5EDE0", borderColor: "rgba(122,72,40,0.25)" }}
      >
        <p className="text-[10px] font-sans tracking-[0.25em] text-primary/70 uppercase mb-3">Research Use Only</p>
        <h2 id="age-gate-title" className="font-serif text-2xl md:text-3xl font-light mb-4" style={{ color: "#1A0E05" }}>
          Age &amp; Research-Use Verification
        </h2>
        <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: "#3D2510" }}>
          Vault Peptides supplies <strong>analytical-grade biochemical reference standards</strong> strictly for
          laboratory, analytical, and <em>in&nbsp;vitro</em> research use by academic, biotech, contract-research,
          and laboratory buyers.
        </p>
        <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: "#3D2510" }}>
          Products are <strong>not for human or animal consumption</strong> and are not drugs, foods, supplements,
          cosmetics, or medical, diagnostic, or therapeutic products. By entering you confirm that you are at least
          <strong> 21 years of age</strong> and are accessing this site in a professional or research capacity.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={confirm}
            className="flex-1 h-12 rounded-none font-sans text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            I confirm — Enter site
          </button>
          <button
            onClick={leave}
            className="flex-1 h-12 rounded-none font-sans text-xs tracking-widest uppercase border transition-colors hover:bg-primary/10"
            style={{ borderColor: "#C8B89E", color: "#1A0E05" }}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
