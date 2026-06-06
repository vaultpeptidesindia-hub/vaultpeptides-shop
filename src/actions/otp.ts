"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const EXPIRY_MINUTES = 10;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendSMS(phone: string, otp: string): Promise<void> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.warn("[OTP] FAST2SMS_API_KEY not set — OTP:", otp);
    return;
  }

  const url = new URL("https://www.fast2sms.com/dev/bulkV2");
  url.searchParams.set("authorization", apiKey);
  url.searchParams.set("variables_values", otp);
  url.searchParams.set("route", "otp");
  url.searchParams.set("numbers", phone);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "cache-control": "no-cache" },
  });

  const data = await res.json();
  if (!data.return) {
    console.error("[OTP] Fast2SMS error:", data.message);
    throw new Error("Failed to send OTP via SMS.");
  }
}

export const sendOTP = async (phone: string) => {
  const parsed = z.string().min(10).max(10).regex(/^\d+$/).safeParse(phone);
  if (!parsed.success) return { error: "Enter a valid 10-digit phone number." };

  // Invalidate previous OTPs
  await db.oTPVerification.updateMany({
    where: { phone, verified: false },
    data: { verified: true },
  });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  await db.oTPVerification.create({
    data: { phone, otp, expiresAt },
  });

  try {
    await sendSMS(phone, otp);
  } catch {
    return { error: "Could not send OTP. Please try again." };
  }

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

  let user = await db.user.findUnique({ where: { phone } });
  if (!user) {
    user = await db.user.create({ data: { phone } });
  }

  return { success: true, userId: user.id };
};
