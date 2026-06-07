"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// Compatible with React 19 useActionState
export async function loginAction(
  _prevState: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password. Check your credentials." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    // Re-throw NEXT_REDIRECT so Next.js handles the navigation
    throw error;
  }

  return { error: "" };
}
