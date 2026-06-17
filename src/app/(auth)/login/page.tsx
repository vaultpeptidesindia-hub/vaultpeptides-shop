"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GoogleButton } from "@/components/auth/google-button";
import Image from "next/image";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: "" });

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: "#F5EDE0" }}>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Vault Peptides"
              width={805}
              height={310}
              className="h-14 w-auto object-contain mx-auto"
              style={{ mixBlendMode: "multiply" }}
            />
          </Link>
        </div>

        <div className="rounded-2xl p-8 space-y-5 border border-border" style={{ backgroundColor: "#EDE1CE" }}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1A0E05" }}>Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: "#3D2510" }}>Sign in to your Vault Peptides account</p>
          </div>

          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
            <>
              <GoogleButton label="Continue with Google" />
              <div className="flex items-center gap-3">
                <span className="h-px flex-1" style={{ backgroundColor: "#C8B89E" }} />
                <span className="text-xs uppercase tracking-widest" style={{ color: "#8B7355" }}>or</span>
                <span className="h-px flex-1" style={{ backgroundColor: "#C8B89E" }} />
              </div>
            </>
          )}

          {/* Native form action — useActionState handles NEXT_REDIRECT correctly */}
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#3D2510" }}>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="h-12"
                style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "#3D2510" }}>Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-12"
                style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
            >
              {isPending ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm" style={{ color: "#3D2510" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
