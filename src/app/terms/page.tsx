import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing your use of vaultpeptides.shop and any purchase of research products from Vault Peptides.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="15 June 2026"
      intro="These Terms & Conditions govern your use of vaultpeptides.shop and your purchase of products from Vault Peptides. By using this website or placing an order, you agree to these terms. If you do not agree, please do not use the site."
    >
      <LegalSection title="1. Eligibility">
        <p>
          You must be at least 18 years of age and legally capable of entering into a binding contract to use this
          website or place an order. By ordering, you confirm that you meet these requirements.
        </p>
      </LegalSection>

      <LegalSection title="2. Nature of products — research use only">
        <p>
          All products are sold <strong>strictly for laboratory and research use only</strong>. They are{" "}
          <strong>not for human or animal consumption</strong> and are not drugs, foods, supplements, or cosmetics.
          By purchasing, you agree to our{" "}
          <a href="/disclaimer" className="text-primary underline underline-offset-2">Research Use Disclaimer</a>{" "}
          and confirm you are qualified to purchase, handle, and use research compounds lawfully in your
          jurisdiction. You assume full responsibility for compliant and safe use.
        </p>
      </LegalSection>

      <LegalSection title="3. Orders and acceptance">
        <p>
          Submitting an order is an offer to purchase. Order details may be confirmed with you over WhatsApp. We
          reserve the right to accept or decline any order at our discretion, including where a product is out of
          stock, where pricing is incorrect, or where we suspect misuse or unlawful intent.
        </p>
      </LegalSection>

      <LegalSection title="4. Pricing and payment">
        <p>
          Prices are listed in Indian Rupees (₹) and may change without notice. Payment terms and instructions are
          confirmed at the time of order. We are not liable for typographical errors in pricing; where an error
          occurs we will inform you before processing.
        </p>
      </LegalSection>

      <LegalSection title="5. Shipping and returns">
        <p>
          Shipping is governed by our{" "}
          <a href="/shipping-policy" className="text-primary underline underline-offset-2">Shipping Policy</a>, and
          cancellations, returns, and refunds by our{" "}
          <a href="/refund-policy" className="text-primary underline underline-offset-2">Refund &amp; Cancellation Policy</a>.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable use">
        <p>
          You agree not to use the website or products for any unlawful purpose, not to resell products for human
          consumption, and not to misrepresent the nature of the products. You may not attempt to disrupt, reverse
          engineer, or gain unauthorised access to the website.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual property">
        <p>
          All content on this website — including text, logos, graphics, and product information — is the property of
          Vault Peptides and may not be copied or reused without our written permission.
        </p>
      </LegalSection>

      <LegalSection title="8. Disclaimer of warranties & limitation of liability">
        <p>
          Products are provided “as is” for research purposes without warranty of any kind, express or implied, to
          the fullest extent permitted by law. To the maximum extent permitted by applicable law, Vault Peptides
          shall not be liable for any indirect, incidental, or consequential loss, or for any loss arising from
          misuse of products. Nothing in these terms excludes liability that cannot be excluded under law.
        </p>
      </LegalSection>

      <LegalSection title="9. Governing law">
        <p>
          These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction
          of the courts of India.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes & contact">
        <p>
          We may update these terms at any time; continued use of the site constitutes acceptance of the updated
          terms. Questions? Contact us on WhatsApp at +91 87225 79999 or via our{" "}
          <a href="/contact" className="text-primary underline underline-offset-2">contact page</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
