export type DiscountType = "NONE" | "PERCENT" | "FLAT";

/** Compute the rupee discount for a subtotal. Always clamped to [0, subtotal]. */
export function computeDiscount(subtotal: number, type: string, value: number): number {
  if (!value || value <= 0) return 0;
  let d = 0;
  if (type === "PERCENT") d = (subtotal * value) / 100;
  else if (type === "FLAT") d = value;
  return Math.min(Math.max(Math.round(d), 0), subtotal);
}

/** Human label for a code's discount, e.g. "10% off" or "₹500 off" or "No discount". */
export function discountLabel(type: string, value: number): string {
  if (type === "PERCENT" && value > 0) return `${value}% off`;
  if (type === "FLAT" && value > 0) return `₹${value.toLocaleString("en-IN")} off`;
  return "No discount";
}
