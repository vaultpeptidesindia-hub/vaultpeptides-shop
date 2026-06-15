import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Research Use Disclaimer",
  description:
    "All Vault Peptides products are sold strictly for laboratory and research use only — not for human or animal consumption.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Important Notice"
      title="Research Use Disclaimer"
      updated="15 June 2026"
      intro="Please read this disclaimer carefully before purchasing from Vault Peptides. By placing an order you confirm that you have read, understood, and agreed to the terms below."
    >
      <LegalSection title="For laboratory research use only">
        <p>
          All products supplied by Vault Peptides are intended <strong>strictly for in-vitro laboratory research
          and development purposes only</strong>. They are <strong>not for human consumption</strong>, not for
          animal consumption, and not for any in-vivo use.
        </p>
        <p>
          Our products are <strong>not drugs, foods, cosmetics, or dietary supplements</strong> and have not been
          approved by any regulatory authority (including the CDSCO or FDA) for the diagnosis, treatment, cure, or
          prevention of any disease or medical condition.
        </p>
      </LegalSection>

      <LegalSection title="No medical or therapeutic claims">
        <p>
          Vault Peptides makes no representation that any product is safe or effective for any human or veterinary
          use. Nothing on this website constitutes medical, clinical, or professional advice. Any information
          provided is for general educational and reference purposes within a research context only.
        </p>
      </LegalSection>

      <LegalSection title="Buyer responsibility">
        <p>
          By purchasing, you represent and warrant that you are a <strong>qualified professional, researcher, or
          institution</strong> at least 18 years of age, that you are legally permitted to purchase and handle
          research compounds in your jurisdiction, and that you will handle, store, use, and dispose of all
          products in accordance with applicable laws, regulations, and good laboratory practice.
        </p>
        <p>
          You assume full responsibility and liability for the safe handling and lawful use of any product
          purchased. Vault Peptides accepts no liability for any misuse, or for any loss, injury, or damage arising
          from improper or unlawful use.
        </p>
      </LegalSection>

      <LegalSection title="Questions">
        <p>
          For any questions about this disclaimer, contact us on WhatsApp at +91 87225 79999 or via our{" "}
          <a href="/contact" className="text-primary underline underline-offset-2">contact page</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
