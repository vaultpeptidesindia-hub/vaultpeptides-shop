"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { computeDiscount } from "@/lib/discount";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Public — validate a code at checkout and preview the discount for a subtotal.
 * Does NOT record usage (that happens only when the order is placed).
 */
export const validateReferralCode = async (rawCode: string, subtotal: number) => {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { error: "Enter a code." };

  const referral = await db.referralCode.findUnique({ where: { code } });
  if (!referral || !referral.active) return { error: "Invalid or expired code." };

  const discount = computeDiscount(subtotal, referral.discountType, referral.discountValue);
  return {
    success: true as const,
    code: referral.code,
    affiliateName: referral.affiliateName,
    discountType: referral.discountType,
    discountValue: referral.discountValue,
    discount,
  };
};

// ── Admin ────────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}

const CreateSchema = z.object({
  code: z.string().min(2, "Code too short").max(40),
  affiliateName: z.string().min(1, "Affiliate name required"),
  affiliatePhone: z.string().min(10, "Valid phone required"),
  discountType: z.enum(["NONE", "PERCENT", "FLAT"]),
  discountValue: z.number().nonnegative(),
});

export const createReferralCode = async (values: z.infer<typeof CreateSchema>) => {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const parsed = CreateSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid fields." };

  const data = parsed.data;
  const code = data.code.trim().toUpperCase().replace(/\s+/g, "");
  const discountValue = data.discountType === "NONE" ? 0 : data.discountValue;

  try {
    const existing = await db.referralCode.findUnique({ where: { code } });
    if (existing) return { error: "That code already exists." };

    await db.referralCode.create({
      data: {
        code,
        affiliateName: data.affiliateName.trim(),
        affiliatePhone: data.affiliatePhone.trim(),
        discountType: data.discountType,
        discountValue,
      },
    });
    revalidatePath("/admin/referrals");
    return { success: "Referral code created." };
  } catch {
    return { error: "Failed to create code." };
  }
};

export const setReferralActive = async (id: string, active: boolean) => {
  if (!(await requireAdmin())) return { error: "Not authorized." };
  try {
    await db.referralCode.update({ where: { id }, data: { active } });
    revalidatePath("/admin/referrals");
    return { success: "Updated." };
  } catch {
    return { error: "Failed to update." };
  }
};

export const deleteReferralCode = async (id: string) => {
  if (!(await requireAdmin())) return { error: "Not authorized." };
  try {
    await db.referralCode.delete({ where: { id } });
    revalidatePath("/admin/referrals");
    return { success: "Deleted." };
  } catch {
    return { error: "Failed to delete (code may be linked to orders). Deactivate it instead." };
  }
};
