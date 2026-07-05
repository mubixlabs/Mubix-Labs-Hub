import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, products } from "@/config/products";
import { getProductDoc, getProductDocs } from "@/lib/mdx";
import { MDXContent } from "@/components/seo/MDXContent";

export function generateStaticParams() {
  return products.flatMap((p) =>
    getProductDocs(p.slug).map((doc) => ({ slug: p.slug, doc: doc.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; doc: string }>;
}): Promise<Metadata> {
  const { slug, doc: docSlug } = await params;
  const product = getProductBySlug(slug);
  const doc = product ? getProductDoc(slug, docSlug) : null;
  if (!product || !doc) return {};

  return {
    title: `${doc.title} — ${product.name} Docs`,
    description: doc.description || `${doc.title} documentation for ${product.name}.`,
    alternates: { canonical: `/products/${product.slug}/docs/${doc.slug}` },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string; doc: string }>;
}) {
  const { slug, doc: docSlug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const doc = getProductDoc(slug, docSlug);
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">{doc.title}</h1>
      {doc.description && <p className="mt-2 text-muted-foreground">{doc.description}</p>}
      <div className="mt-8">
        <MDXContent source={doc.content} />
      </div>
    </div>
  );
}
