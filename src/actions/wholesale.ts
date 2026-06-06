"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const WholesaleSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email(),
  businessType: z.string().min(1),
  monthlyVolume: z.string().min(1),
  message: z.string().optional(),
});

export const submitWholesaleInquiry = async (values: z.infer<typeof WholesaleSchema>) => {
  const parsed = WholesaleSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid fields." };

  await db.wholesaleInquiry.create({ data: parsed.data });

  return { success: true };
};
