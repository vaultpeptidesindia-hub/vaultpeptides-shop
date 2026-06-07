"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await login({
        email: fd.get("email") as string,
        password: fd.get("password") as string,
      });
      // If res has an error, show it. Otherwise the server action redirects automatically.
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
      // No else — on success, NextAuth redirects to /dashboard via the server action
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: "#F5EDE0" }}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block">
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

        <div className="bg-card border border-border rounded-2xl p-8 space-y-5" style={{ backgroundColor: "#EDE1CE" }}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1A0E05" }}>Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: "#3D2510" }}>Sign in to your Vault Peptides account</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#3D2510" }}>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-12"
                style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" style={{ color: "#3D2510" }}>Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-12"
                style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
            >
              {loading ? "Signing in…" : "Sign In"}
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
