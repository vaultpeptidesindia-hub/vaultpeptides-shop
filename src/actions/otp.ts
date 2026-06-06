"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const EXPIRY_MINUTES = 10;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOTP = async (phone: string) => {
  const parsed = z.string().min(10).safeParse(phone);
  if (!parsed.success) return { error: "Invalid phone number." };

  // Invalidate any existing OTPs for this phone
  await db.oTPVerification.updateMany({
    where: { phone, verified: false },
    data: { verified: true },
  });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  await db.oTPVerification.create({
    data: { phone, otp, expiresAt },
  });

  // TODO: integrate SMS provider (Twilio / Fast2SMS / MSG91)
  // For now, log OTP to server console for testing
  console.log(`[OTP] Phone: ${phone} | OTP: ${otp}`);

  return { success: true };
};

export const verifyOTP = async (phone: string, otp: string) => {
  const record = await db.oTPVerification.findFirst({
    where: {
      phone,
      otp,
      verified: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return { error: "Invalid or expired OTP." };

  await db.oTPVerification.update({
    where: { id: record.id },
    data: { verified: true },
  });

  // Find or create user by phone
  let user = await db.user.findUnique({ where: { phone } });
  if (!user) {
    user = await db.user.create({ data: { phone } });
  }

  return { success: true, userId: user.id };
};
