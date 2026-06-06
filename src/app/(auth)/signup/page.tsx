"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="Vault Peptides" width={805} height={310} className="h-14 w-auto object-contain mx-auto" style={{ mixBlendMode: "multiply" }} />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join Vault Peptides today</p>
          </div>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          {success && <Alert className="border-primary/50 text-primary"><AlertDescription>{success}</AlertDescription></Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required className="bg-background h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-background h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required className="bg-background h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} placeholder="Min. 6 characters" className="bg-background h-12" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
