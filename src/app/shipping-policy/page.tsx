import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "How Vault Peptides processes, ships, and delivers research-peptide orders across India, including timelines and tracking.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      updated="15 June 2026"
      intro="This policy explains how we process and deliver your order. By placing an order you agree to the terms below."
    >
      <LegalSection title="1. Shipping coverage">
        <p>We currently ship across India. For bulk or wholesale enquiries, please contact us before ordering.</p>
      </LegalSection>

      <LegalSection title="2. Order processing time">
        <p>
          Orders are typically processed within 1–3 business days after order confirmation. Orders are not processed
          or shipped on Sundays and public holidays. You will be kept informed over WhatsApp.
        </p>
      </LegalSection>

      <LegalSection title="3. Delivery time">
        <p>
          Once dispatched, delivery usually takes 3–7 business days depending on your location. Remote areas may take
          longer. These timelines are estimates and not guaranteed, as delivery is handled by third-party courier
          partners.
        </p>
      </LegalSection>

      <LegalSection title="4. Shipping charges">
        <p>
          Shipping charges, if any, are confirmed at the time of order. We may offer free shipping on qualifying
          orders from time to time.
        </p>
      </LegalSection>

      <LegalSection title="5. Tracking">
        <p>
          Where available, tracking details are shared with you over WhatsApp once your order is dispatched so you
          can follow its progress.
        </p>
      </LegalSection>

      <LegalSection title="6. Accurate address & delays">
        <p>
          Please ensure your shipping address and phone number are accurate and complete. We are not responsible for
          delays or non-delivery caused by an incorrect address, an unavailable recipient, or events beyond our
          control (such as courier delays, weather, or regulatory checks). If a parcel is returned due to an
          incorrect address or failed delivery, re-shipping charges may apply.
        </p>
      </LegalSection>

      <LegalSection title="7. Damaged or lost shipments">
        <p>
          If your order arrives damaged, or does not arrive within a reasonable time, contact us promptly on WhatsApp
          at +91 87225 79999 and we will work with you and the courier to resolve it. Please see our{" "}
          <a href="/refund-policy" className="text-primary underline underline-offset-2">Refund &amp; Cancellation Policy</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
