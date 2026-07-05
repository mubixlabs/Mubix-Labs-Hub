import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { MarketingScripts } from "@/components/layout/MarketingScripts";
import { PageTransition } from "@/components/layout/PageTransition";
import { FaviconSwitcher } from "@/components/layout/FaviconSwitcher";
import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Developer Tools That Remove Friction`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Developer Tools That Remove Friction`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Developer Tools That Remove Friction`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@mubixlabs",
  },
  icons: {
    apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0E1116" },
    { media: "(prefers-color-scheme: light)", color: "#ECE9E2" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon-512.png`,
  sameAs: [siteConfig.links.github, siteConfig.links.twitter, siteConfig.links.linkedin],
  contactPoint: {
    "@type": "ContactPoint",
    email: siteConfig.contact.support,
    contactType: "customer support",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Favicon is managed entirely by <FaviconSwitcher/> below (client-side,
            live theme detection). No static <link rel="icon"> here on purpose --
            having both a static one AND a JS-managed one caused the two to
            fight each other, which is what made switching inconsistent. */}
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Header />
        <FaviconSwitcher />
        <main id="main-content" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <ChatWidget />
        <CookieConsent />
        <MarketingScripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
