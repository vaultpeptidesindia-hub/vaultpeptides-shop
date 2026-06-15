import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Vault Peptides order cancellation, return, and refund terms for research products, including damaged or incorrect items.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      updated="15 June 2026"
      intro="We want you to be confident ordering from Vault Peptides. This policy explains when orders can be cancelled, returned, or refunded. Because our products are sensitive research materials, some restrictions apply for safety and product integrity."
    >
      <LegalSection title="1. Cancellations">
        <p>
          You may request to cancel an order before it has been dispatched. Once an order has shipped, it can no
          longer be cancelled. To cancel, contact us as soon as possible on WhatsApp at +91 87225 79999.
        </p>
      </LegalSection>

      <LegalSection title="2. Returns — research material integrity">
        <p>
          For the safety and integrity of research compounds, products that have shipped are generally{" "}
          <strong>non-returnable</strong> once they leave our facility, except in the cases described below. We
          cannot accept returns of opened, used, or tampered products.
        </p>
      </LegalSection>

      <LegalSection title="3. Damaged, defective, or incorrect items">
        <p>
          If you receive an item that is damaged in transit, defective, or different from what you ordered, contact
          us within <strong>48 hours of delivery</strong> with your order number and clear photos. After
          verification, we will offer a free replacement or a refund. Please do not discard the item or packaging
          until the issue is resolved.
        </p>
      </LegalSection>

      <LegalSection title="4. Refund process & timeline">
        <p>
          Approved refunds are issued to your original payment method (or another method agreed with you). Once
          approved, refunds are typically processed within 5–7 business days, though the time for funds to appear may
          vary by bank or payment provider.
        </p>
      </LegalSection>

      <LegalSection title="5. Non-refundable situations">
        <ul className="list-disc pl-5 space-y-1">
          <li>Orders where an incorrect shipping address was provided by the customer.</li>
          <li>Products that have been opened, used, or tampered with (outside of a verified defect).</li>
          <li>Returns requested after the 48-hour reporting window for damaged or incorrect items.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Contact">
        <p>
          For any cancellation or refund request, reach us on WhatsApp at +91 87225 79999 or via our{" "}
          <a href="/contact" className="text-primary underline underline-offset-2">contact page</a>. We aim to make
          every issue right.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
