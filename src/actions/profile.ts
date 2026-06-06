"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
});

export const updateProfile = async (values: z.infer<typeof ProfileSchema>) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const parsed = ProfileSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid fields." };

  await db.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone },
  });

  return { success: true };
};
