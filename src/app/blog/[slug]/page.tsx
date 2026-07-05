import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMainBlogPost, getMainBlogPosts } from "@/lib/mdx";
import { MDXContent } from "@/components/seo/MDXContent";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return getMainBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getMainBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || post.title,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${siteConfig.url}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getMainBlogPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {post.date} · {post.readingTime}
      </p>
      <div className="mt-8">
        <MDXContent source={post.content} />
      </div>
    </article>
  );
}
