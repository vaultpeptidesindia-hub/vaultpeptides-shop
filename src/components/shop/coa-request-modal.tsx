"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestCOA } from "@/actions/coa";
import { toast } from "sonner";

interface COARequestModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
}

export function COARequestModal({
  open,
  onClose,
  productName,
  productId,
}: COARequestModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await requestCOA({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      productId,
      productName,
    });
    setLoading(false);
    if (res.success) {
      toast.success("COA request submitted! We'll email you the certificate shortly.");
      onClose();
    } else {
      toast.error(res.error || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Request Certificate of Analysis</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Request the COA for <span className="text-primary font-semibold">{productName}</span>.
            We&apos;ll email it to you within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="coa-name">Full Name</Label>
            <Input id="coa-name" name="name" required placeholder="John Doe" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coa-email">Email Address</Label>
            <Input id="coa-email" name="email" type="email" required placeholder="you@example.com" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coa-phone">Phone Number</Label>
            <Input id="coa-phone" name="phone" required placeholder="+91 98765 43210" className="bg-background" />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
          >
            {loading ? "Submitting…" : "Submit Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
