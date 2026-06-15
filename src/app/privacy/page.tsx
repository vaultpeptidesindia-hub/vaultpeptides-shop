import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Vault Peptides collects, uses, stores, and protects your personal information, in line with India's IT Act and DPDP Act.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="15 June 2026"
      intro="Vault Peptides (“we”, “us”, “our”) respects your privacy. This policy explains what personal information we collect, why we collect it, how we protect it, and the choices you have. It applies to vaultpeptides.shop and any orders placed with us."
    >
      <LegalSection title="1. Information we collect">
        <p>We collect only what we need to process your orders and run your account:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Account details:</strong> name, email address, phone number, and a securely hashed password.</li>
          <li><strong>Order details:</strong> shipping address, items ordered, and order history.</li>
          <li><strong>Communications:</strong> messages you send us (e.g. via the contact form or WhatsApp).</li>
          <li><strong>Technical data:</strong> essential cookies required to keep you signed in.</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How we use your information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To create and manage your account.</li>
          <li>To process, confirm, and ship your orders (including order confirmation over WhatsApp).</li>
          <li>To respond to your enquiries and provide Certificates of Analysis on request.</li>
          <li>To keep our website secure and prevent fraud.</li>
          <li>To meet our legal and regulatory obligations.</li>
        </ul>
        <p>We do <strong>not</strong> sell or rent your personal information to anyone.</p>
      </LegalSection>

      <LegalSection title="3. Sharing your information">
        <p>
          We share information only where necessary: with shipping/logistics partners to deliver your order, with
          service providers that host our website and database under confidentiality obligations, and where required
          by law or a valid legal request. Order confirmation may take place over WhatsApp using the phone number you
          provide.
        </p>
      </LegalSection>

      <LegalSection title="4. Data storage and security">
        <p>
          Your data is stored on secured, access-controlled cloud infrastructure. Passwords are never stored in
          plain text — they are hashed using industry-standard bcrypt. We use encrypted connections (HTTPS) across
          the site. While no method of transmission is completely secure, we take reasonable measures to protect
          your information.
        </p>
      </LegalSection>

      <LegalSection title="5. Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal information at any time, and you may
          withdraw consent where processing is based on consent. To exercise these rights, contact us using the
          details below and we will respond within a reasonable period.
        </p>
      </LegalSection>

      <LegalSection title="6. Data retention">
        <p>
          We keep your information for as long as your account is active or as needed to fulfil orders, comply with
          legal obligations, resolve disputes, and enforce our agreements. You can ask us to delete your account.
        </p>
      </LegalSection>

      <LegalSection title="7. Children">
        <p>
          Our website and products are intended only for users aged 18 and over. We do not knowingly collect
          information from minors.
        </p>
      </LegalSection>

      <LegalSection title="8. Legal framework">
        <p>
          We handle personal data in accordance with applicable Indian law, including the Information Technology Act,
          2000 and the Information Technology (Reasonable Security Practices and Sensitive Personal Data or
          Information) Rules, 2011, and we are committed to aligning with the Digital Personal Data Protection Act,
          2023 as it comes into force.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes & contact">
        <p>
          We may update this policy from time to time; the “last updated” date above reflects the latest version.
          For any privacy questions or requests, contact us on WhatsApp at +91 87225 79999 or via our{" "}
          <a href="/contact" className="text-primary underline underline-offset-2">contact page</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
