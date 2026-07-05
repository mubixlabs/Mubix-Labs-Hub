export const siteConfig = {
  name: "Mubix Labs",
  shortName: "Mubix",
  pronunciation: "Moo-bix (rhymes with cubic)",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://products.mubixlabs.studio",
  corporateUrl: "https://mubixlabs.studio",
  description:
    "Mubix Labs builds developer productivity tools VS Code extensions, Chrome extensions, and micro SaaS products designed to remove friction from the development workflow.",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/mubixlabs",
    twitter: "https://x.com/MubixLabs",
    linkedin: "https://www.linkedin.com/in/mubix-labs-80656141a/",
  },
  contact: {
    support: "support@mubixlabs.studio",
    hello: "hello@mubixlabs.studio",
    legal: "legal@mubixlabs.studio",
    privacy: "privacy@mubixlabs.studio",
  },
  brand: {
    colors: {
      primary: "#F2A33D", // Amber
      bgDark: "#0E1116",
      bgLight: "#ECE9E2",
      success: "#59C788",
      error: "#E5626A",
    },
  },
  keywords: [
    "developer tools",
    "VS Code extension",
    "SEO checker VS Code",
    "accessibility checker",
    "micro SaaS",
    "developer productivity",
    "Mubix Labs",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
