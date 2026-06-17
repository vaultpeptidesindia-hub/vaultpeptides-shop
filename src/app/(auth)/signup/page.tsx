"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GoogleButton } from "@/components/auth/google-button";
import Image from "next/image";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const data = await register({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        phone: fd.get("phone") as string,
        password: fd.get("password") as string,
      });
      if (data?.error) {
        setError(data.error);
      } else {
        setSuccess("Account created! Redirecting to login…");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
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

        <div className="rounded-2xl p-8 space-y-5 border border-border" style={{ backgroundColor: "#EDE1CE" }}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1A0E05" }}>Create an account</h1>
            <p className="text-sm mt-1" style={{ color: "#3D2510" }}>Join Vault Peptides today</p>
          </div>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          {success && (
            <Alert className="border-primary/50">
              <AlertDescription style={{ color: "#6B3520" }}>{success}</AlertDescription>
            </Alert>
          )}

          {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
            <>
              <GoogleButton label="Sign up with Google" />
              <div className="flex items-center gap-3">
                <span className="h-px flex-1" style={{ backgroundColor: "#C8B89E" }} />
                <span className="text-xs uppercase tracking-widest" style={{ color: "#8B7355" }}>or</span>
                <span className="h-px flex-1" style={{ backgroundColor: "#C8B89E" }} />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: "#3D2510" }}>Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required className="h-12"
                style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#3D2510" }}>Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required className="h-12"
                style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" style={{ color: "#3D2510" }}>Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required className="h-12"
                style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "#3D2510" }}>Password</Label>
              <Input id="password" name="password" type="password" required minLength={6}
                placeholder="Min. 6 characters" className="h-12"
                style={{ backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" }} />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
            >
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm" style={{ color: "#3D2510" }}>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
