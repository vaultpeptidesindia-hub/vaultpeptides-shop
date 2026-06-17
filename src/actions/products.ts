"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  basePrice: z.number().nonnegative(),
  categoryId: z.string().min(1),
  images: z.array(z.string()),
  status: z.enum(["ACTIVE", "DRAFT"]),
  isFeatured: z.boolean().default(false),
});

export const createProduct = async (values: z.infer<typeof ProductSchema>) => {
  const validatedFields = ProductSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  // images is a Postgres text[] column — pass the array directly
  const { images, ...rest } = validatedFields.data;

  try {
    await db.product.create({ data: { ...rest, images } });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: "Product created!" };
  } catch {
    return { error: "Failed to create product." };
  }
};

export const updateProduct = async (id: string, values: z.infer<typeof ProductSchema>) => {
  const validatedFields = ProductSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { images, ...rest } = validatedFields.data;

  try {
    await db.product.update({ where: { id }, data: { ...rest, images } });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/product/${values.slug}`);
    return { success: "Product updated!" };
  } catch {
    return { error: "Failed to update product." };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: "Product deleted!" };
  } catch {
    return { error: "Failed to delete product." };
  }
};

export const getCategories = async () => {
  return await db.category.findMany({ orderBy: { name: "asc" } });
};
