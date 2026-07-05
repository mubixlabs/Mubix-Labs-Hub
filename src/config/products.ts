export type ProductCategory =
  | "vscode-extension"
  | "chrome-extension"
  | "saas"
  | "open-source";

export type PricingTier = {
  id: string;
  name: string;
  price: {
    monthly: number | null; // null = custom/contact
    yearly: number | null;
    unit?: string; // e.g. "per seat"
  };
  tagline: string;
  features: string[];
  cta: string;
  ctaHref: string; // Lemon Squeezy checkout link or mailto
  highlighted?: boolean;
  minSeats?: number;
};

export type Product = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: ProductCategory;
  status: "active" | "coming-soon";
  icon: string; // lucide-react icon name
  color: string; // accent color for this product's pages
  marketplaceUrl?: string; // VS Code Marketplace / Chrome Web Store
  githubUrl?: string;
  installCommand?: string;
  elevatorPitch: string;
  doNotSay?: string[];
  pricing: PricingTier[];
  faqPricing: { q: string; a: string }[];
  changelog: { version: string; date: string; changes: string[] }[];
  // Lemon Squeezy identifiers (fill after creating store/products there)
  lemonSqueezy?: {
    storeId?: string;
    productId?: string;
    variantIds?: Record<string, string>; // tierId -> variant id
  };
};

export const products: Product[] = [
  {
    slug: "seo-insight-engine",
    name: "SEO Insight Engine",
    shortDescription:
      "Catch SEO, performance, and accessibility issues before you deploy without leaving your editor.",
    longDescription:
      "A VS Code extension that runs SEO, accessibility, Core Web Vitals, and schema checks directly inside your editor. No context switching, no separate browser tab just predictable checks that run where you already work.",
    category: "vscode-extension",
    status: "active",
    icon: "SearchCheck",
    color: "#F2A33D",
    marketplaceUrl:
      "https://marketplace.visualstudio.com/items?itemName=mubixlabs.seo-insight-engine",
    githubUrl: "https://github.com/mubixlabs/seo-insight-engine",
    installCommand: "ext install seo-insight-engine",
    elevatorPitch:
      "SEO Insight Engine is a VS Code extension that catches SEO, performance, and accessibility issues before you deploy without leaving your editor.",
    doNotSay: [
      'Do not describe as a "website checker" it works inside the code editor, not the browser',
      'Do not describe as an "SEO plugin" it is a VS Code extension',
    ],
    pricing: [
      {
        id: "free",
        name: "Free",
        price: { monthly: 0, yearly: 0 },
        tagline: "For developers who want instant feedback without leaving their editor.",
        features: [
          "SEO fundamentals check (title, meta description, headings, canonical tags)",
          "Accessibility scan (alt text, ARIA labels, contrast, form labels)",
          "robots.txt and sitemap.xml validator",
          "JSON-LD Schema generator (Article, Product, Review)",
          "Single image compression (JPG/PNG → WebP)",
          "Dead code & unused import detector",
          "Static HTML support",
          "No account required",
        ],
        cta: "Install Free",
        ctaHref:
          "https://marketplace.visualstudio.com/items?itemName=mubixlabs.seo-insight-engine",
      },
      {
        id: "pro",
        name: "Pro",
        price: { monthly: 7, yearly: 59 },
        tagline: "For freelancers who need to prove their work and deliver faster.",
        features: [
          "Everything in Free",
          "Real-time Core Web Vitals audit (LCP, CLS, INP)",
          "Lighthouse performance scoring inside the editor",
          "Visual dashboard panel with color-coded scores",
          "Audit history",
          "Multi-framework support (React, Next.js, Vue, Angular, Astro, Svelte)",
          "Bulk image optimizer",
          "On-save SEO checks",
          "Broken link detector",
          "Social preview checker (OG, Twitter Card)",
          "PDF audit report export",
        ],
        cta: "Start Pro 7-day free trial",
        ctaHref: "#", // Lemon Squeezy checkout link goes here
        highlighted: true,
      },
      {
        id: "pro-ai",
        name: "Pro + AI",
        price: { monthly: 14, yearly: 109 },
        tagline: "For developers who want to fix issues, not just find them.",
        features: [
          "Everything in Pro",
          "AI meta description writer",
          "AI alt text generator",
          "AI content readability analyzer",
          "Smart SEO recommendations",
          "AI schema assistant",
          "Priority email support",
        ],
        cta: "Start Pro + AI 7-day free trial",
        ctaHref: "#",
      },
      {
        id: "team",
        name: "Team",
        price: { monthly: 24, yearly: 199, unit: "per seat" },
        minSeats: 3,
        tagline: "For engineering teams who want quality gates, not post-deploy surprises.",
        features: [
          "Everything in Pro + AI",
          "Pre-commit score gate",
          "Shared team dashboard",
          "Centralized audit history",
          "Custom score thresholds per project",
          "Team license management",
          "Dedicated support channel",
          "Onboarding call (1 per team)",
        ],
        cta: "Contact for Team Pricing",
        ctaHref: `mailto:support@mubixlabs.studio?subject=Team Plan Inquiry SEO Insight Engine`,
      },
    ],
    faqPricing: [
      {
        q: "Do I need to create an account for the free plan?",
        a: "No. Install the extension and free features work immediately. An account is only needed for Pro and above.",
      },
      {
        q: "What happens when my trial ends?",
        a: "You're automatically moved to the Free plan. No charge unless you confirm an upgrade.",
      },
      {
        q: "Can I switch between plans?",
        a: "Yes, upgrade or downgrade anytime. Downgrades take effect at the end of your current billing period.",
      },
      {
        q: "Do AI features send my code or content to a third party?",
        a: "AI features process your page's publicly-visible content only the same content Google's crawlers see. No source code, credentials, or private data is ever transmitted.",
      },
      {
        q: "Is there a refund policy?",
        a: "Yes 14-day no-questions-asked refund on all paid plans.",
      },
      {
        q: "Do you offer student discounts?",
        a: "Yes. Students with a verified .edu email or GitHub Student Pack get 50% off Pro for 12 months.",
      },
    ],
    changelog: [
      {
        version: "1.0.0",
        date: "2026-07-01",
        changes: [
          "SEO and accessibility checker",
          "Schema (JSON-LD) generator",
          "Dead code / unused import detector",
          "Image optimizer (single file, JPG/PNG → WebP)",
          "Full audit via live URL (headless browser, all frameworks)",
          "Core Web Vitals / Lighthouse performance audit (Pro)",
          "Visual dashboard panel (Pro)",
          "License key validation system",
        ],
      },
    ],
    lemonSqueezy: {
      storeId: "",
      productId: "",
      variantIds: {
        pro: "",
        "pro-ai": "",
      },
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getActiveProducts(): Product[] {
  return products.filter((p) => p.status === "active");
}
