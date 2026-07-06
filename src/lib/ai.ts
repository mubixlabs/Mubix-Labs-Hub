import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { products } from "@/config/products";
import { siteConfig } from "@/config/site";
import { getProductDocs, getProductBlogPosts } from "@/lib/mdx";

/**
 * Builds the full grounding context from real site content — product data,
 * every doc page, and blog posts — so the assistant answers from the same
 * facts a developer would find by reading the docs themselves, instead of
 * guessing. Rebuilt on cold start; cheap enough given the current content size.
 */
function buildKnowledgeBase(): string {
  const sections: string[] = [];

  for (const product of products) {
    sections.push(`## ${product.name} (${product.category})
${product.longDescription}

Marketplace: ${product.marketplaceUrl ?? "N/A"}
GitHub: ${product.githubUrl ?? "N/A"}
Install: ${product.installCommand ?? "N/A"}`);

    sections.push(
      `### Pricing for ${product.name}\n` +
        product.pricing
          .map(
            (t) =>
              `- ${t.name}: $${t.price.monthly ?? "custom"}/mo${
                t.price.yearly ? ` ($${t.price.yearly}/yr)` : ""
              } — ${t.tagline}\n  Features: ${t.features.join("; ")}`
          )
          .join("\n")
    );

    if (product.faqPricing.length) {
      sections.push(
        `### Pricing FAQ for ${product.name}\n` +
          product.faqPricing.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")
      );
    }

    const docs = getProductDocs(product.slug);
    for (const doc of docs) {
      sections.push(`### Doc: ${doc.title} (${product.name})\n${doc.content}`);
    }

    const posts = getProductBlogPosts(product.slug);
    for (const post of posts) {
      sections.push(`### Blog post: ${post.title} (${product.name})\n${post.content}`);
    }
  }

  return sections.join("\n\n---\n\n");
}

let cachedSystemPrompt: string | null = null;

function getSystemPrompt(): string {
  if (cachedSystemPrompt) return cachedSystemPrompt;

  cachedSystemPrompt = `You are the support assistant for ${siteConfig.name} (pronounced "${siteConfig.pronunciation}"), a company that builds developer productivity tools. You have deep, accurate knowledge of every product below treat this as ground truth, not a summary to gesture at.

${buildKnowledgeBase()}

Rules:
- Answer from the knowledge base above with real specifics exact prices, exact feature names, exact command names like someone who has actually read the docs, not someone paraphrasing vaguely.
- Be direct and concise (3-6 sentences) unless the user asks for a full walkthrough, in which case give clear numbered steps.
- Never say "check our docs" as a way to avoid answering you have the docs above. Only point to a doc page if the user wants the full original page, or the linked URL is genuinely useful.
- If something isn't covered in the knowledge base (e.g. an exact bug, something highly specific to their setup), say so honestly and suggest emailing ${siteConfig.contact.support}. Never invent features, prices, or policies not listed above.
- Stay strictly on topic: ${siteConfig.name}, its products, pricing, licensing, and technical setup. Politely redirect anything unrelated.
- Sound like a sharp, friendly human teammate not a corporate script.`;

  return cachedSystemPrompt;
}

let client: GoogleGenerativeAI | null = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

export class ChatServiceError extends Error {
  constructor(
    message: string,
    public readonly kind: "rate_limit" | "blocked" | "empty" | "unknown"
  ) {
    super(message);
  }
}

export async function getChatResponse(
  history: { role: "user" | "model"; text: string }[],
  message: string
): Promise<string> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    systemInstruction: getSystemPrompt(),
    // Default safety thresholds ("BLOCK_MEDIUM_AND_ABOVE") can occasionally
    // over-block completely benign conversational text. Since this is a
    // narrow-purpose product support bot (not open-ended user content),
    // relaxing to BLOCK_ONLY_HIGH avoids false-positive blocks while still
    // stopping genuinely harmful content.
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ],
  });

  const chat = model.startChat({
    history: history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    generationConfig: { maxOutputTokens: 512, temperature: 0.5 },
  });

  let result;
  try {
    result = await chat.sendMessage(message);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Gemini API call failed:", msg);
    if (msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate")) {
      throw new ChatServiceError("Rate limited by Gemini API", "rate_limit");
    }
    throw new ChatServiceError(msg, "unknown");
  }

  const candidate = result.response.candidates?.[0];
  const finishReason = candidate?.finishReason;

  if (finishReason && finishReason !== "STOP" && finishReason !== "MAX_TOKENS") {
    console.error("Gemini response blocked or incomplete:", finishReason, result.response.promptFeedback);
    throw new ChatServiceError(`Response blocked (${finishReason})`, "blocked");
  }

  let text: string;
  try {
    text = result.response.text();
  } catch (err) {
    console.error("Failed to extract text from Gemini response:", err, result.response.promptFeedback);
    throw new ChatServiceError("Empty or blocked response", "empty");
  }

  if (!text || !text.trim()) {
    throw new ChatServiceError("Empty response text", "empty");
  }

  return text;
}
