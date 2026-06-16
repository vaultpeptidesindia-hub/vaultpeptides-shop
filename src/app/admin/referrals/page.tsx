export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { ReferralManager } from "@/components/admin/referral-manager";

export default async function AdminReferralsPage() {
  const codes = await db.referralCode.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Referral Codes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create affiliate codes tied to a collaborator&apos;s WhatsApp. They&apos;re notified each time their code is used at checkout.
        </p>
      </div>
      <ReferralManager codes={codes} />
    </div>
  );
}
