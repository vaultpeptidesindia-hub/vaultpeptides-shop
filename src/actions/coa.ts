"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

const COASchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  productId: z.string().optional(),
  productName: z.string().optional(),
});

export const requestCOA = async (values: z.infer<typeof COASchema>) => {
  const parsed = COASchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid fields." };

  const session = await auth();

  await db.cOARequest.create({
    data: {
      ...parsed.data,
      userId: session?.user?.id ?? null,
    },
  });

  return { success: true };
};
