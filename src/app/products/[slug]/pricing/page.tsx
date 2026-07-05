import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, products } from "@/config/products";
import { PricingTiers } from "@/components/sections/PricingTiers";

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

  return {
    title: `${product.name} Pricing`,
    description: `Simple, honest pricing for ${product.name}. Free forever plan, no hidden fees.`,
    alternates: { canonical: `/products/${product.slug}/pricing` },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Simple pricing for {product.name}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Whether you&apos;re shipping a side project or managing a client portfolio, there&apos;s
          a plan that fits.
        </p>
      </div>

      <PricingTiers tiers={product.pricing} />

      {product.faqPricing.length > 0 && (
        <section className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center">
            Pricing FAQ
          </h2>
          <div className="mt-8 space-y-6">
            {product.faqPricing.map((item) => (
              <div key={item.q} className="border-b border-border pb-6">
                <h3 className="font-semibold text-foreground">{item.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
