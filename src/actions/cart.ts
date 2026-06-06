"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getCart = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  return await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });
};

export const addToCart = async (variantId: string, quantity: number = 1) => {
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
        cartId_variantId: {
          cartId: cart.id,
          variantId,
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
          variantId,
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

export const mergeCart = async (items: { variantId: string; quantity: number }[]) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not logged in." };

  try {
    let cart = await db.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId: session.user.id },
      });
    }

    for (const item of items) {
      const existingItem = await db.cartItem.findUnique({
        where: {
          cartId_variantId: {
            cartId: cart.id,
            variantId: item.variantId,
          },
        },
      });

      if (existingItem) {
        await db.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await db.cartItem.create({
          data: {
            cartId: cart.id,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        });
      }
    }

    revalidatePath("/cart");
    return { success: true };
  } catch {
    return { error: "Failed to merge cart." };
  }
};
