// Central SEO config + JSON-LD structured data builders.
// Organization + WebSite schema drive the brand knowledge panel and help
// "Vault Peptides" resolve to this site in search.

export const SITE_URL = "https://vaultpeptides.shop";
export const SITE_NAME = "Vault Peptides";
export const SITE_DESC =
  "Vault Peptides supplies premium, laboratory-tested research peptides in India. 99%+ purity, HPLC & MS certified, COA available on request.";

// Business WhatsApp (also used for orders/COA). Keep in sync with lib/whatsapp.ts.
const WHATSAPP_E164 = "+918722579999";

// Social / external profiles that reference the brand. Add real URLs here as
// they go live (Instagram, X, LinkedIn, etc.) — they strengthen brand identity
// in Google's eyes (the `sameAs` signal feeds the knowledge panel).
export const SOCIAL_PROFILES: string[] = [];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "Vault Peptides India",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 805,
    height: 310,
  },
  image: `${SITE_URL}/logo.png`,
  description: SITE_DESC,
  areaServed: "IN",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: WHATSAPP_E164,
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["en", "hi"],
  },
  ...(SOCIAL_PROFILES.length > 0 ? { sameAs: SOCIAL_PROFILES } : {}),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESC,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/** Product rich-result schema for a product detail page. */
export function productSchema(p: {
  name: string;
  slug: string;
  description: string;
  image?: string;
  prices: number[];
  inStock: boolean;
}) {
  const lowest = p.prices.length ? Math.min(...p.prices) : undefined;
  const highest = p.prices.length ? Math.max(...p.prices) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description.slice(0, 5000),
    ...(p.image ? { image: p.image.startsWith("http") ? p.image : `${SITE_URL}${p.image}` } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    url: `${SITE_URL}/product/${p.slug}`,
    ...(lowest !== undefined
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: lowest,
            highPrice: highest,
            offerCount: p.prices.length,
            availability: p.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            seller: { "@id": `${SITE_URL}/#organization` },
          },
        }
      : {}),
  };
}

/** Breadcrumb schema. items: [{name, url}] in order (Home → … → current). */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}
