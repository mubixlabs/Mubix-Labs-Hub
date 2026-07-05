import type { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.googletagmanager.com https://connect.facebook.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  font-src 'self' data:;
  connect-src 'self' https://*.googleapis.com https://firestore.googleapis.com https://generativelanguage.googleapis.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://*.upstash.io https://www.google-analytics.com https://analytics.google.com https://googleads.g.doubleclick.net https://www.facebook.com;
  frame-src https://www.facebook.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.mubixlabs.studio" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Long-term caching for static assets
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // Fixes a known Next.js App Router bug: after using browser back/forward,
    // the first click on a Link to a page already in the router cache does
    // nothing (a second click is needed). Setting staleTimes to 0 forces a
    // fresh navigation every time instead of silently reusing stale cached
    // route data. This trades a tiny bit of cache reuse for correctness —
    // pages are still fully static/prerendered, so the extra fetch is cheap
    // and doesn't meaningfully affect performance.
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
};

export default nextConfig;
