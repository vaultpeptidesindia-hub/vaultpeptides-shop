"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { login } from "@/actions/login";
import { sendOTP, verifyOTP } from "@/actions/otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

type Tab = "email" | "phone";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Phone OTP state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const router = useRouter();

  // ── Email login ──────────────────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await login({ email: fd.get("email") as string, password: fd.get("password") as string });
      if (res?.error) setError(res.error);
      else router.push("/dashboard");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google login ─────────────────────────────────────────
  const handleGoogle = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  // ── Phone OTP: send ──────────────────────────────────────
  const handleSendOTP = async () => {
    setError("");
    if (!phone || phone.length < 10) { setError("Enter a valid phone number."); return; }
    setLoading(true);
    const res = await sendOTP(phone);
    setLoading(false);
    if (res.error) setError(res.error);
    else setOtpSent(true);
  };

  // ── Phone OTP: verify ────────────────────────────────────
  const handleVerifyOTP = async () => {
    setError("");
    if (!otp || otp.length !== 6) { setError("Enter the 6-digit OTP."); return; }
    setLoading(true);
    const res = await verifyOTP(phone, otp);
    if (res.error) { setError(res.error); setLoading(false); return; }

    // Sign in using the phone-otp provider
    const result = await signIn("phone-otp", {
      userId: res.userId,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) setError("Sign-in failed. Try again.");
    else router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <Image src="/logo.png" alt="Vault Peptides" width={52} height={52} className="object-contain" />
            <span className="text-xl font-bold tracking-tighter">VAULT PEPTIDES</span>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          {/* Google button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-border hover:border-primary/50 gap-3"
            onClick={handleGoogle}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl border border-border p-1 gap-1">
            <button
              onClick={() => { setTab("email"); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === "email" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => { setTab("phone"); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === "phone" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Phone OTP
            </button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email tab */}
          {tab === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-background h-12" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input id="password" name="password" type="password" required className="bg-background h-12" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          )}

          {/* Phone OTP tab */}
          {tab === "phone" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-background border border-input rounded-md text-sm text-muted-foreground shrink-0">
                    🇮🇳 +91
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    disabled={otpSent}
                    maxLength={10}
                    className="bg-background h-12"
                  />
                </div>
              </div>

              {!otpSent ? (
                <Button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading || phone.length < 10}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                >
                  {loading ? "Sending OTP…" : "Send OTP"}
                </Button>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      className="bg-background h-12 tracking-[0.5em] text-center text-lg font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                      OTP sent to +91 {phone}.{" "}
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
                        className="text-primary hover:underline"
                      >
                        Change number
                      </button>
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                  >
                    {loading ? "Verifying…" : "Verify & Sign In"}
                  </Button>
                </>
              )}
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
