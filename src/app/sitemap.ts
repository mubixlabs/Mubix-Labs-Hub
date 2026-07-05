import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getActiveProducts } from "@/config/products";
import { getMainBlogPosts, getProductDocs, getProductBlogPosts } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = [];
  for (const product of getActiveProducts()) {
    productRoutes.push(
      {
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${baseUrl}/products/${product.slug}/pricing`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/products/${product.slug}/docs`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      },
      {
        url: `${baseUrl}/products/${product.slug}/blog`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      }
    );

    for (const doc of getProductDocs(product.slug)) {
      productRoutes.push({
        url: `${baseUrl}/products/${product.slug}/docs/${doc.slug}`,
        lastModified: doc.date ? new Date(doc.date) : now,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }

    for (const post of getProductBlogPosts(product.slug)) {
      productRoutes.push({
        url: `${baseUrl}/products/${product.slug}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : now,
        changeFrequency: "monthly",
        priority: 0.65,
      });
    }
  }

  const blogRoutes: MetadataRoute.Sitemap = getMainBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
