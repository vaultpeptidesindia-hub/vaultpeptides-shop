"use server";

import { signIn } from "@/auth";

/** Start the Google OAuth flow, then land on the dashboard. */
export async function googleSignIn() {
  await signIn("google", { redirectTo: "/dashboard" });
}
