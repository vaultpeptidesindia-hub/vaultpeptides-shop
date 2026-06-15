// Product.images is stored as a JSON-encoded string array (portable across
// SQLite + Postgres). These helpers safely decode it for the UI.

export function parseImages(images: string | null | undefined): string[] {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    // Tolerate a bare path that was stored without JSON encoding.
    return typeof images === "string" && images.startsWith("/") ? [images] : [];
  }
}

export function firstImage(
  images: string | null | undefined,
  fallback = "/logo.png"
): string {
  return parseImages(images)[0] ?? fallback;
}
