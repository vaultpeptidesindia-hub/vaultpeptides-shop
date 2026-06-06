"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CheckoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode required"),
  country: z.string().default("India"),
  items: z
    .array(
      z.object({
        variantId: z.string(),
        quantity: z.number().min(1),
        price: z.number(),
        productName: z.string(),
        variantName: z.string(),
      })
    )
    .optional(),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;

export const processCheckout = async (values: CheckoutInput) => {
  const session = await auth();
  const userId = session?.user?.id;

  const validatedFields = CheckoutSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields: " + validatedFields.error.issues[0]?.message };
  }

  const { name, email, phone, line1, line2, city, state, pincode, country, items: localItems } =
    validatedFields.data;

  interface OrderLineItem {
    variantId: string;
    quantity: number;
    price: number;
    productName: string;
    variantName: string;
  }

  let cartItemsToOrder: OrderLineItem[] = [];

  if (userId) {
    const cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    if (cart && cart.items.length > 0) {
      cartItemsToOrder = cart.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.variant.price,
        productName: item.variant.product.name,
        variantName: item.variant.name,
      }));
    }
  }

  if (cartItemsToOrder.length === 0 && localItems && localItems.length > 0) {
    cartItemsToOrder = localItems;
  }

  if (cartItemsToOrder.length === 0) {
    return { error: "Your cart is empty!" };
  }

  const totalAmount = cartItemsToOrder.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const orderNumber = `VP-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    const order = await db.order.create({
      data: {
        orderNumber,
        totalAmount,
        status: "PENDING",
        ...(userId && { userId }),
        shippingAddress: { name, email, phone, line1, line2, city, state, pincode, country },
        items: {
          create: cartItemsToOrder.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
    });

    if (userId) {
      const cart = await db.cart.findUnique({ where: { userId } });
      if (cart) {
        await db.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    revalidatePath("/dashboard/orders");
    revalidatePath("/cart");

    return {
      success: true,
      orderId: order.orderNumber,
      orderData: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item) => ({
          productName: item.variant.product.name,
          variantName: item.variant.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { error: "Failed to place order. Please try again." };
  }
};
