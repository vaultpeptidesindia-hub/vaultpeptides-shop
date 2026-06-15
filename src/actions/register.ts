"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { appendCustomer } from "@/lib/ledger";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().min(10, "Valid phone number required"),
});

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, phone } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 12);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash: hashedPassword,
    },
  });

  // Also save a clean, human-readable copy to data/customers.json + .csv
  await appendCustomer({ name, email, phone, source: "signup" });

  return { success: "User created!" };
};
