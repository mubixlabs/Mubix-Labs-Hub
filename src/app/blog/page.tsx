import Link from "next/link";
import type { Metadata } from "next";
import { getMainBlogPosts } from "@/lib/mdx";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Engineering notes, product updates, and developer productivity insights from ${siteConfig.name}.`,
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getMainBlogPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Blog</h1>
      <p className="mt-2 text-muted-foreground">
        Engineering notes, product updates, and developer productivity insights.
      </p>

      <div className="mt-10 space-y-8">
        {posts.length === 0 && (
          <p className="text-sm text-muted-foreground">No posts yet check back soon.</p>
        )}
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} prefetch={false} className="block group">
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
