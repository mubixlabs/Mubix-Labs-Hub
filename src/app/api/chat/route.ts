import { NextRequest, NextResponse } from "next/server";
import { getChatResponse, ChatServiceError } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = await checkRateLimit(`chat:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.slice(0, 2000) : "";
    const rawHistory = Array.isArray(body.history) ? body.history.slice(-10) : [];

    // Gemini's API requires chat history to start with a "user" role message
    // and strictly alternate after that. The chat widget's UI seeds the
    // conversation with a hardcoded greeting ("model" role) so there's
    // something to show before the visitor types anything -- but that
    // greeting must never be sent to Gemini as history, or every request
    // gets rejected. Drop any leading messages until the first "user" one.
    const firstUserIndex = rawHistory.findIndex(
      (h: { role?: string }) => h?.role === "user"
    );
    const history = firstUserIndex === -1 ? [] : rawHistory.slice(firstUserIndex);

    if (!message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const reply = await getChatResponse(history, message);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);

    if (err instanceof ChatServiceError) {
      if (err.kind === "rate_limit") {
        return NextResponse.json(
          { error: "Our AI provider is briefly at capacity. Please try again in a few seconds." },
          { status: 429 }
        );
      }
      if (err.kind === "blocked" || err.kind === "empty") {
        return NextResponse.json(
          {
            error:
              "I couldn't generate a reply to that one try rephrasing, or email us at " +
              "support@mubixlabs.studio if this keeps happening.",
          },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }
}
