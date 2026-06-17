// Product.images is a PostgreSQL text[] array. These helpers safely read it.
// Also handles legacy JSON-encoded strings in case any old rows exist.

export function parseImages(images: string | string[] | null | undefined): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter((x): x is string => typeof x === "string");
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return typeof images === "string" && images.startsWith("/") ? [images] : [];
  }
}

export function firstImage(
  images: string | string[] | null | undefined,
  fallback = "/logo.png"
): string {
  return parseImages(images)[0] ?? fallback;
}
