"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getCart = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  return await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please login to add items to cart." };

  try {
    let cart = await db.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId: session.user.id },
      });
    }

    const existingItem = await db.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    revalidatePath("/cart");
    return { success: "Added to cart!" };
  } catch {
    return { error: "Failed to add to cart." };
  }
};

export const removeFromCart = async (itemId: string) => {
  try {
    await db.cartItem.delete({
      where: { id: itemId },
    });
    revalidatePath("/cart");
    return { success: "Removed from cart!" };
  } catch {
    return { error: "Failed to remove from cart." };
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  try {
    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity: Math.max(1, quantity) },
    });
    revalidatePath("/cart");
    return { success: "Updated quantity!" };
  } catch {
    return { error: "Failed to update quantity." };
  }
};
