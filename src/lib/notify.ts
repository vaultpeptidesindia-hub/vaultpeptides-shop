// Affiliate notification — sends a WhatsApp message to a referral-code owner
// whenever their code is used at checkout.
//
// Outbound (business-initiated) WhatsApp requires an APPROVED message template.
// Two providers are supported, selected via env `WHATSAPP_PROVIDER`:
//
//   meta   → Meta WhatsApp Cloud API (uses your own WhatsApp Business number)
//            env: META_WA_PHONE_NUMBER_ID, META_WA_TOKEN,
//                 META_WA_TEMPLATE (approved template name), META_WA_LANG (default "en")
//            Template should take 3 body params, in order: {{1}} code, {{2}} order #, {{3}} amount.
//
//   twilio → Twilio WhatsApp
//            env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM (e.g. "whatsapp:+1415…"),
//                 TWILIO_WA_CONTENT_SID (approved Content template) optional; falls back to body text.
//
// If no provider/creds are configured it just logs (best-effort). It NEVER throws —
// a failed notification must never break an order.

type CodeUsedPayload = {
  affiliatePhone: string;
  affiliateName: string;
  code: string;
  orderNumber: string;
  orderTotal: number;
};

/** Strip formatting and ensure a country code (defaults to India 91 for 10-digit numbers). */
function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 10) digits = "91" + digits; // bare Indian mobile
  if (digits.startsWith("0")) digits = "91" + digits.slice(1);
  return digits;
}

function plainMessage(p: CodeUsedPayload): string {
  return (
    `Vault Peptides: your referral code *${p.code}* was just used on order ${p.orderNumber} ` +
    `(₹${p.orderTotal.toLocaleString("en-IN")}). Thanks for the referral, ${p.affiliateName}!`
  );
}

async function sendViaMeta(p: CodeUsedPayload): Promise<boolean> {
  const phoneNumberId = process.env.META_WA_PHONE_NUMBER_ID;
  const token = process.env.META_WA_TOKEN;
  const template = process.env.META_WA_TEMPLATE;
  const lang = process.env.META_WA_LANG || "en";
  if (!phoneNumberId || !token || !template) return false;

  const to = normalizePhone(p.affiliatePhone);
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: template,
        language: { code: lang },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: p.code },
              { type: "text", text: p.orderNumber },
              { type: "text", text: `₹${p.orderTotal.toLocaleString("en-IN")}` },
            ],
          },
        ],
      },
    }),
  });
  if (!res.ok) {
    console.error("[notify] Meta WhatsApp send failed:", res.status, await res.text());
    return false;
  }
  return true;
}

async function sendViaTwilio(p: CodeUsedPayload): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"
  if (!sid || !authToken || !from) return false;

  const to = `whatsapp:+${normalizePhone(p.affiliatePhone)}`;
  const body = new URLSearchParams({ From: from, To: to });

  const contentSid = process.env.TWILIO_WA_CONTENT_SID;
  if (contentSid) {
    body.set("ContentSid", contentSid);
    body.set(
      "ContentVariables",
      JSON.stringify({ "1": p.code, "2": p.orderNumber, "3": `₹${p.orderTotal.toLocaleString("en-IN")}` })
    );
  } else {
    body.set("Body", plainMessage(p));
  }

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${sid}:${authToken}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    console.error("[notify] Twilio WhatsApp send failed:", res.status, await res.text());
    return false;
  }
  return true;
}

/** Best-effort: notify an affiliate that their code was used. Never throws. */
export async function notifyAffiliateCodeUsed(p: CodeUsedPayload): Promise<void> {
  try {
    const provider = (process.env.WHATSAPP_PROVIDER || "").toLowerCase();
    let sent = false;
    if (provider === "meta") sent = await sendViaMeta(p);
    else if (provider === "twilio") sent = await sendViaTwilio(p);

    if (!sent) {
      // No provider configured (or send failed) — log so it's visible in server logs.
      console.log(`[notify] (no WhatsApp provider) ${plainMessage(p)} → ${normalizePhone(p.affiliatePhone)}`);
    }
  } catch (err) {
    console.error("[notify] affiliate notification error:", err);
  }
}
