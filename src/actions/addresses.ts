"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AddressSchema = z.object({
  name: z.string().optional(),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode required"),
  country: z.string().default("India"),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof AddressSchema>;

export const addAddress = async (values: AddressInput) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const parsed = AddressSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid fields." };

  const userId = session.user.id;
  const existing = await db.address.count({ where: { userId } });
  // First address is the default automatically; otherwise honour the flag.
  const makeDefault = parsed.data.isDefault || existing === 0;

  if (makeDefault) {
    await db.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  await db.address.create({
    data: {
      userId,
      name: parsed.data.name,
      line1: parsed.data.line1,
      line2: parsed.data.line2,
      city: parsed.data.city,
      state: parsed.data.state,
      pincode: parsed.data.pincode,
      country: parsed.data.country,
      isDefault: makeDefault,
    },
  });

  revalidatePath("/dashboard/addresses");
  revalidatePath("/dashboard");
  return { success: true };
};

export const setDefaultAddress = async (addressId: string) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };
  const userId = session.user.id;

  // Guard: address must belong to this user.
  const owned = await db.address.findFirst({ where: { id: addressId, userId } });
  if (!owned) return { error: "Address not found." };

  await db.address.updateMany({ where: { userId }, data: { isDefault: false } });
  await db.address.update({ where: { id: addressId }, data: { isDefault: true } });

  revalidatePath("/dashboard/addresses");
  revalidatePath("/dashboard");
  return { success: true };
};

export const getDefaultAddress = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return db.address.findFirst({ where: { userId: session.user.id, isDefault: true } });
};

export const updateAddress = async (id: string, values: AddressInput) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const parsed = AddressSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid fields." };

  const userId = session.user.id;
  const owned = await db.address.findFirst({ where: { id, userId } });
  if (!owned) return { error: "Address not found." };

  await db.address.update({ where: { id }, data: parsed.data });
  revalidatePath("/dashboard/addresses");
  revalidatePath("/dashboard");
  return { success: true };
};

export const deleteAddress = async (addressId: string) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };
  const userId = session.user.id;

  const owned = await db.address.findFirst({ where: { id: addressId, userId } });
  if (!owned) return { error: "Address not found." };

  await db.address.delete({ where: { id: addressId } });

  // If we removed the default, promote the most recent remaining address.
  if (owned.isDefault) {
    const next = await db.address.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
    if (next) await db.address.update({ where: { id: next.id }, data: { isDefault: true } });
  }

  revalidatePath("/dashboard/addresses");
  revalidatePath("/dashboard");
  return { success: true };
};
