"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { updateProfile } from "@/actions/profile";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<{ name: string; email: string; phone: string } | null>(null);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then(setProfile);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await updateProfile({
      name: fd.get("name") as string,
      phone: fd.get("phone") as string,
    });
    setLoading(false);
    if (res.success) toast.success("Profile updated!");
    else toast.error(res.error || "Something went wrong.");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-12 max-w-2xl">
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }), "mb-6 -ml-2 text-muted-foreground hover:text-foreground")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-8">Profile Settings</h1>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={profile?.name ?? ""} required className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={profile?.email ?? ""} disabled className="bg-background opacity-60" />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" defaultValue={profile?.phone ?? ""} placeholder="+91 98765 43210" className="bg-background" />
              </div>
              <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
                {loading ? "Saving…" : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
