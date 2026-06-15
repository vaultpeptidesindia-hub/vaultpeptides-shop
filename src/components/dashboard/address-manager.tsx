"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Star, Check } from "lucide-react";
import { addAddress, deleteAddress, setDefaultAddress } from "@/actions/addresses";

export interface AddressRow {
  id: string;
  name: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export function AddressManager({ addresses }: { addresses: AddressRow[] }) {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [pending, startTransition] = useTransition();

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const res = await addAddress({
        name: (fd.get("name") as string) || undefined,
        line1: fd.get("line1") as string,
        line2: (fd.get("line2") as string) || undefined,
        city: fd.get("city") as string,
        state: fd.get("state") as string,
        pincode: fd.get("pincode") as string,
        country: "India",
        isDefault: fd.get("isDefault") === "on",
      });
      if (res.success) {
        toast.success("Address saved.");
        form.reset();
        setShowForm(false);
      } else {
        toast.error(res.error || "Could not save address.");
      }
    });
  };

  const handleDefault = (id: string) =>
    startTransition(async () => {
      const res = await setDefaultAddress(id);
      if (res.success) toast.success("Default address updated.");
      else toast.error(res.error || "Failed.");
    });

  const handleDelete = (id: string) =>
    startTransition(async () => {
      const res = await deleteAddress(id);
      if (res.success) toast.success("Address removed.");
      else toast.error(res.error || "Failed.");
    });

  const inputStyle = { backgroundColor: "#FAF5EE", borderColor: "#C8B89E", color: "#1A0E05" };

  return (
    <div className="space-y-8">
      {/* Saved addresses */}
      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <Card key={a.id} className="bg-card border-border relative">
            <CardContent className="pt-6">
              {a.isDefault && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <Star className="h-3 w-3 fill-primary" /> Default
                </span>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm space-y-0.5">
                  {a.name && <p className="font-semibold">{a.name}</p>}
                  <p>{a.line1}</p>
                  {a.line2 && <p>{a.line2}</p>}
                  <p>{a.city}, {a.state} – {a.pincode}</p>
                  <p className="text-muted-foreground">{a.country}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {!a.isDefault && (
                  <Button variant="outline" size="sm" disabled={pending} onClick={() => handleDefault(a.id)}>
                    <Check className="mr-1 h-3.5 w-3.5" /> Set default
                  </Button>
                )}
                <Button variant="ghost" size="sm" disabled={pending} onClick={() => handleDelete(a.id)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add new */}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add new address
        </Button>
      ) : (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Add a new address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name (optional)</Label>
                <Input id="name" name="name" placeholder="John Doe" style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line1">Address line 1 *</Label>
                <Input id="line1" name="line1" required placeholder="House / Flat no., Street" style={inputStyle} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line2">Address line 2 (optional)</Label>
                <Input id="line2" name="line2" placeholder="Landmark, Area" style={inputStyle} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" required placeholder="Mumbai" style={inputStyle} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" name="state" required placeholder="Maharashtra" style={inputStyle} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input id="pincode" name="pincode" required placeholder="400001" style={inputStyle} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isDefault" className="h-4 w-4 accent-primary" />
                Set as default address
              </label>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={pending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {pending ? "Saving…" : "Save address"}
                </Button>
                {addresses.length > 0 && (
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
