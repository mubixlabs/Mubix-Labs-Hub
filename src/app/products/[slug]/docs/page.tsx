import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import { getProductBySlug, products } from "@/config/products";
import { getProductDocs } from "@/lib/mdx";
import { ForceNavLink } from "@/components/layout/ForceNavLink";

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
    title: `${product.name} Documentation`,
    description: `Complete reference and guides for ${product.name}.`,
    alternates: { canonical: `/products/${product.slug}/docs` },
  };
}

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const docs = getProductDocs(product.slug).sort(
    (a, b) => ((a.order as number) ?? 99) - ((b.order as number) ?? 99)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">{product.name} Documentation</h1>
      <p className="mt-2 text-muted-foreground">
        Installation, commands, features, and troubleshooting.
      </p>

      <div className="mt-10 space-y-3">
        {docs.length === 0 && (
          <p className="text-sm text-muted-foreground">Documentation coming soon.</p>
        )}
        {docs.map((doc) => (
          <ForceNavLink
            key={doc.slug}
            href={`/products/${product.slug}/docs/${doc.slug}`}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors"
          >
            <span className="flex items-center gap-3">
              <BookOpen size={18} className="text-primary" />
              <span>
                <span className="block font-medium text-foreground">{doc.title}</span>
                {doc.description && (
                  <span className="block text-sm text-muted-foreground">{doc.description}</span>
                )}
              </span>
            </span>
            <ArrowRight size={16} className="text-muted-foreground" />
          </ForceNavLink>
        ))}
      </div>
    </div>
  );
}
