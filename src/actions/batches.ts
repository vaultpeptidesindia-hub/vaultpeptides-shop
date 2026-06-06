"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const BatchSchema = z.object({
  batchNumber: z.string().min(1),
  productIds: z.array(z.string()).min(1),
  testedAt: z.string().optional(),
  expiresAt: z.string().optional(),
  coaUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const createBatch = async (values: z.infer<typeof BatchSchema>) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized." };

  const parsed = BatchSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid fields." };

  const { batchNumber, productIds, testedAt, expiresAt, coaUrl, notes } = parsed.data;

  await db.batchNumber.create({
    data: {
      batchNumber,
      testedAt: testedAt ? new Date(testedAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      coaUrl: coaUrl || null,
      notes: notes || null,
      products: {
        create: productIds.map((productId) => ({ productId })),
      },
    },
  });

  revalidatePath("/admin/batches");
  return { success: true };
};
