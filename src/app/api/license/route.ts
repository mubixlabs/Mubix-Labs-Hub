import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const sig = Buffer.from(signature, "utf8");
  return digest.length === sig.length && crypto.timingSafeEqual(digest, sig);
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.LICENSE_PROVIDER_WEBHOOK_SECRET;
    if (!secret) {
      console.error("LICENSE_PROVIDER_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");

    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName: string = payload.meta?.event_name ?? "unknown";
    const data = payload.data;

    const db = getAdminDb();

    // Store every event for auditability; license status is derived from the latest event.
    await db.collection("lemonSqueezyEvents").add({
      eventName,
      receivedAt: new Date().toISOString(),
      payload,
    });

    if (
      ["order_created", "subscription_created", "subscription_updated", "subscription_cancelled"].includes(
        eventName
      )
    ) {
      const email =
        data?.attributes?.user_email ?? data?.attributes?.customer_email ?? "unknown";
      const orderId = data?.id ?? data?.attributes?.order_id;

      if (email && email !== "unknown") {
        await db
          .collection("licenses")
          .doc(String(orderId ?? email))
          .set(
            {
              email,
              status: data?.attributes?.status ?? "unknown",
              eventName,
              productName: data?.attributes?.product_name ?? null,
              variantName: data?.attributes?.variant_name ?? null,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("License webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
