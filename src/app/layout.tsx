import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { CartSync } from "@/components/shop/cart-sync";
import { SpineLoader } from "@/components/spine-loader";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { AgeGate } from "@/components/age-gate";
import Footer from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema, SITE_URL } from "@/lib/seo";

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vault Peptides | Premium Research Peptides India",
    template: "%s | Vault Peptides",
  },
  description:
    "Vault Peptides — premium, laboratory-tested research peptides in India. 99%+ purity, HPLC & MS certified, COA on request. Fast pan-India shipping.",
  keywords: ["Vault Peptides", "research peptides", "buy peptides India", "biotech compounds", "HPLC tested peptides", "peptides India", "COA peptides"],
  applicationName: "Vault Peptides",
  authors: [{ name: "Vault Peptides" }],
  creator: "Vault Peptides",
  publisher: "Vault Peptides",
  alternates: { canonical: "/" },
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Vault Peptides",
    title: "Vault Peptides | Premium Research Peptides India",
    description: "High-purity research peptides. 99%+ purity. HPLC & MS certified. India's trusted research-peptide supplier.",
    images: [{ url: "/logo.png", alt: "Vault Peptides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vault Peptides | Premium Research Peptides India",
    description: "High-purity research peptides with a 99%+ purity guarantee.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Paste the token from Google Search Console (Settings → Ownership → HTML tag)
  // to verify the property and unlock indexing reports.
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-foreground" style={{ backgroundColor: "#F2EBE1" }}>
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <AgeGate />
        <SpineLoader />
        <CartSync isLoggedIn={!!session} />
        <div style={{ position: "relative", zIndex: 10 }} className="flex flex-col min-h-full">
          {children}
          <Footer />
        </div>
        <WhatsAppButton />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
