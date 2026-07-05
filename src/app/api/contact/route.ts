import { NextRequest, NextResponse } from "next/server";
import DOMPurify from "isomorphic-dompurify";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mailer";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

function sanitize(input: string) {
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = await checkRateLimit(`contact:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check - if filled, silently pretend success (bot behavior)
    if (body.company && body.company.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = sanitize(String(body.name || "")).slice(0, 200);
    const email = sanitize(String(body.email || "")).slice(0, 200);
    const subject = sanitize(String(body.subject || "")).slice(0, 300);
    const message = sanitize(String(body.message || "")).slice(0, 5000);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !emailRegex.test(email) || !subject || message.length < 10) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    if (!process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASSWORD) {
      console.error("Zoho SMTP credentials not configured");
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
    }

    await sendMail({
      to: process.env.EMAIL_TO || siteConfig.contact.support,
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      fromLabel: "Mubix Labs Website",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
