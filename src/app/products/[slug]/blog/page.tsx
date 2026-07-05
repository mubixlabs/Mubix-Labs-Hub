import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, products } from "@/config/products";
import { getProductBlogPosts } from "@/lib/mdx";

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
    title: `${product.name} Blog`,
    description: `Updates, guides, and insights about ${product.name}.`,
    alternates: { canonical: `/products/${product.slug}/blog` },
  };
}

export default async function ProductBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const posts = getProductBlogPosts(product.slug);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">{product.name} Blog</h1>
      <p className="mt-2 text-muted-foreground">Updates, guides, and behind-the-scenes notes.</p>

      <div className="mt-10 space-y-8">
        {posts.length === 0 && (
          <p className="text-sm text-muted-foreground">No posts yet check back soon.</p>
        )}
        {posts.map((post) => (
          <Link key={post.slug} href={`/products/${product.slug}/blog/${post.slug}`} prefetch={false} className="block group">
            <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            {post.description && (
              <p className="mt-1.5 text-sm text-muted-foreground">{post.description}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {post.date} · {post.readingTime}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
