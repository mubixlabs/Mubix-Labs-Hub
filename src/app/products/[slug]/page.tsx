import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Download } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { getProductBySlug, products } from "@/config/products";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} | ${product.elevatorPitch}`;

  return {
    title: product.name,
    description: product.elevatorPitch,
    keywords: [
      product.name,
      `${product.name} VS Code extension`,
      "SEO checker VS Code",
      "accessibility checker VS Code",
      "Core Web Vitals extension",
    ],
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description: product.longDescription,
      url: `${siteConfig.url}/products/${product.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.longDescription,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    description: product.longDescription,
    offers: product.pricing
      .filter((t) => t.price.monthly !== null)
      .map((t) => ({
        "@type": "Offer",
        name: t.name,
        price: t.price.monthly,
        priceCurrency: "USD",
      })),
    url: `${siteConfig.url}/products/${product.slug}`,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />

      <span
        className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: `${product.color}1a`, color: product.color }}
      >
        {product.category === "vscode-extension" ? "VS Code Extension" : product.category}
      </span>

      <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
        {product.name}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        {product.elevatorPitch}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        {product.marketplaceUrl && (
          <a
            href={product.marketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Download size={16} />
            Install Free from Marketplace
          </a>
        )}
        <Link prefetch={false}
          href={`/products/${product.slug}/pricing`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          View Pricing
          <ArrowRight size={16} />
        </Link>
        {product.githubUrl && (
          <a
            href={product.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <GithubIcon size={16} />
            GitHub
          </a>
        )}
      </div>

      {product.installCommand && (
        <div className="mt-6 rounded-xl border border-border bg-card px-4 py-3 font-mono text-sm text-muted-foreground">
          <span className="text-primary">$</span> {product.installCommand}
        </div>
      )}

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-foreground">About {product.name}</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
          {product.longDescription}
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-foreground">What&apos;s included in Free</h2>
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.pricing[0].features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check size={16} className="mt-0.5 shrink-0 text-success" />
              {feature}
            </li>
          ))}
        </ul>
        <Link prefetch={false}
          href={`/products/${product.slug}/pricing`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          See all plans and pricing
          <ArrowRight size={14} />
        </Link>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-bold text-foreground">Ready to try {product.name}?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Free forever plan, no account required to start.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {product.marketplaceUrl && (
            <a
              href={product.marketplaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Install Free
            </a>
          )}
          <Link prefetch={false}
            href={`/products/${product.slug}/docs`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Read the Docs
          </Link>
        </div>
      </section>
    </div>
  );
}
