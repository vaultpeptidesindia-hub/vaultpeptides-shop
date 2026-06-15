// Central WhatsApp config + helpers. Update the number here once and it applies
// everywhere (COA requests, checkout, floating button).

export const WHATSAPP_NUMBER = "918722579999";

/** Build a wa.me deep link with a pre-filled message. */
export function buildWaLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Redirect the current tab to WhatsApp with a pre-filled message.
 *
 * Uses same-tab navigation (window.location) instead of window.open /
 * target="_blank". Popup-style opens are blocked by browsers when they fire
 * AFTER an `await` (e.g. after the checkout server action resolves) because the
 * user-gesture/transient-activation is gone. Location navigation is never
 * popup-blocked, so this reliably reaches WhatsApp on both mobile + desktop.
 */
export function openWhatsApp(message: string): void {
  if (typeof window === "undefined") return;
  window.location.href = buildWaLink(message);
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
