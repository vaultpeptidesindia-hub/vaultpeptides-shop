"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CheckoutSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(6),
  country: z.string().default("India"),
});

export const processCheckout = async (values: z.infer<typeof CheckoutSchema>) => {
  const session = await auth();
  const userId = session?.user?.id;

  const validatedFields = CheckoutSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid address fields!" };
  }

  const { name, email, phone, line1, line2, city, state, pincode, country } = validatedFields.data;

  if (!userId) {
    return { error: "Please login to place an order." };
  }

  // Get cart items
  const cart = await db.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  });

  if (!cart || cart.items.length === 0) {
    return { error: "Your cart is empty!" };
  }

  const totalAmount = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const orderNumber = `VP-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    // Save order to DB
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: userId!,
        totalAmount,
        status: "PENDING",
        shippingAddress: {
          name, email, phone, line1, line2, city, state, pincode, country
        },
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          }))
        }
      },
      include: { items: { include: { product: true } } }
    });

    // Clear cart
    await db.cartItem.deleteMany({ where: { cartId: cart.id } });

    revalidatePath("/dashboard/orders");
    revalidatePath("/cart");

    return { 
      success: true, 
      orderId: order.orderNumber,
      orderData: order
    };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { error: "Failed to place order. Please try again." };
  }
};
