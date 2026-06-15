// Central WhatsApp config + helpers. Update the number here once and it applies
// everywhere (COA requests, checkout, floating button).

export const WHATSAPP_NUMBER = "918722579999";

/** Build a wa.me deep link with a pre-filled message. */
export function buildWaLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Open WhatsApp with a pre-filled message in a new tab.
 * Uses a synthetic anchor click — more reliable than window.open for wa.me
 * deep links across mobile + desktop browsers.
 */
export function openWhatsApp(message: string): void {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  a.href = buildWaLink(message);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Pre-filled message for a Certificate of Analysis request. */
export function coaMessage(productName: string, variantName?: string): string {
  const item = variantName ? `${productName} (${variantName})` : productName;
  return (
    `Hello Vault Peptides,\n\n` +
    `I'd like to request the *Certificate of Analysis (COA)* for:\n` +
    `*${item}*\n\n` +
    `My name: \nEmail: \n\nThank you!`
  );
}
