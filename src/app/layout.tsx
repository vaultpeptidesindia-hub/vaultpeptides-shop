import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { CartSync } from "@/components/shop/cart-sync";
import { SpineLoader } from "@/components/spine-loader";
import { WhatsAppButton } from "@/components/whatsapp-button";

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://vaultpeptides.shop"),
  title: {
    default: "Vault Peptides | Premium Research Bio-Tech",
    template: "%s | Vault Peptides",
  },
  description:
    "High-purity, laboratory-tested research peptides and compounds. 99%+ purity guaranteed. HPLC & MS certified. Fast shipping across India.",
  keywords: ["research peptides", "buy peptides India", "biotech compounds", "HPLC tested peptides", "Vault Peptides"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vaultpeptides.shop",
    siteName: "Vault Peptides",
    title: "Vault Peptides | Premium Research Bio-Tech",
    description: "High-purity research peptides. 99%+ purity. HPLC certified. India's trusted biotech research supplier.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vault Peptides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vault Peptides | Premium Research Bio-Tech",
    description: "High-purity research peptides with 99%+ purity guarantee.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-foreground" style={{ backgroundColor: "#F2EBE1" }}>
        <SpineLoader />
        <CartSync isLoggedIn={!!session} />
        <div style={{ position: "relative", zIndex: 10 }} className="flex flex-col min-h-full">
          {children}
        </div>
        <WhatsAppButton />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
