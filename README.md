# Mubix Labs — Products Hub

`products.mubixlabs.studio` — the hub site for all Mubix Labs developer tools (VS Code extensions, Chrome extensions, micro SaaS products).

## Tech Stack

- **Framework:** Next.js 15+ (App Router, TypeScript, static generation)
- **Styling:** Tailwind CSS v4
- **Content:** MDX (docs, blog posts, legal pages) via `next-mdx-remote`
- **Backend:** Firebase (Firestore) for license/webhook data
- **AI Chat:** Google Gemini
- **Email:** Zoho Mail SMTP (your own mubixlabs.studio mailboxes via nodemailer)
- **Rate limiting:** Upstash Redis
- **Payments/Licensing:** Lemon Squeezy
- **Hosting:** Vercel

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a New Product

No new routes or pages need to be written. The entire `/products/[slug]/*` route tree is dynamic and statically generated from data:

1. Add a new entry to `src/config/products.ts` (name, pricing, description, icon, colors, Lemon Squeezy variant IDs)
2. Create content folders:
   ```
   src/content/products/<new-slug>/docs/*.mdx
   src/content/products/<new-slug>/blog/*.mdx
   ```
3. Deploy. The product automatically appears on `/products`, gets its own landing/pricing/docs/blog pages, and is included in `sitemap.xml`.

## Environment Variables

See `.env.example` for the full list. Required for a working deploy:

- `NEXT_PUBLIC_FIREBASE_*` — Firebase client config
- `FIREBASE_ADMIN_*` — Firebase Admin service account (server only)
- `GEMINI_API_KEY` — powers the chat widget
- `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASSWORD`, `EMAIL_TO` — contact form email delivery via your Zoho mailbox
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — rate limiting on `/api/chat` and `/api/contact`
- `LICENSE_PROVIDER_WEBHOOK_SECRET` — Lemon Squeezy webhook signature verification

## Project Structure

```
src/
├── app/                    # routes (App Router)
│   ├── (marketing)/        # about, contact
│   ├── (legal)/            # privacy, terms, cookies
│   ├── blog/                # global company blog
│   ├── products/[slug]/    # dynamic product pages (landing, pricing, docs, blog)
│   └── api/                 # chat, contact, license webhook
├── components/
│   ├── layout/              # Header, Footer, MobileSidebar, CookieConsent
│   ├── chat/                 # ChatWidget
│   ├── sections/             # Hero, ProductCard, ContactForm
│   └── seo/                  # MDXContent renderer
├── content/
│   ├── legal/                # privacy-policy.mdx, terms-of-service.mdx, cookie-policy.mdx
│   ├── pages/                 # about.mdx
│   ├── main-blog/             # global blog posts
│   └── products/<slug>/       # per-product docs/ and blog/
├── config/
│   ├── site.ts                 # brand, contact, colors
│   └── products.ts             # single source of truth for all products
└── lib/                        # firebase, firebase-admin, ai, mdx, rate-limit, utils
```

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.example`
4. Attach custom domain `products.mubixlabs.studio`
5. Set up the Lemon Squeezy webhook to point to `https://products.mubixlabs.studio/api/license`

## SEO Checklist

- [x] Dynamic `sitemap.xml` (auto-includes every product, doc, and blog post)
- [x] `robots.txt` allowing full crawl, blocking `/api/`
- [x] Per-page canonical URLs and Open Graph/Twitter metadata
- [x] JSON-LD: Organization (site-wide), SoftwareApplication (per product), Article (per blog post)
- [x] Security headers (CSP, HSTS, X-Frame-Options, etc.) in `next.config.ts`
