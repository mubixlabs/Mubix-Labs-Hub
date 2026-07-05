import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

export type ContentMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  readingTime: string;
  [key: string]: unknown;
};

export type ContentEntry = ContentMeta & { content: string };

function readDir(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

function readEntry(dirPath: string, filename: string): ContentEntry {
  const raw = fs.readFileSync(path.join(dirPath, filename), "utf-8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.mdx?$/, "");
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    author: data.author,
    readingTime: readingTime(content).text,
    content,
    ...data,
  };
}

// ---------- Global (main) blog ----------
export function getMainBlogPosts(): ContentEntry[] {
  const dir = path.join(CONTENT_DIR, "main-blog");
  return readDir(dir)
    .map((f) => readEntry(dir, f))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getMainBlogPost(slug: string): ContentEntry | null {
  const dir = path.join(CONTENT_DIR, "main-blog");
  const file = readDir(dir).find((f) => f.replace(/\.mdx?$/, "") === slug);
  return file ? readEntry(dir, file) : null;
}

// ---------- Per-product docs ----------
export function getProductDocs(productSlug: string): ContentEntry[] {
  const dir = path.join(CONTENT_DIR, "products", productSlug, "docs");
  return readDir(dir).map((f) => readEntry(dir, f));
}

export function getProductDoc(productSlug: string, docSlug: string): ContentEntry | null {
  const dir = path.join(CONTENT_DIR, "products", productSlug, "docs");
  const file = readDir(dir).find((f) => f.replace(/\.mdx?$/, "") === docSlug);
  return file ? readEntry(dir, file) : null;
}

// ---------- Per-product blog ----------
export function getProductBlogPosts(productSlug: string): ContentEntry[] {
  const dir = path.join(CONTENT_DIR, "products", productSlug, "blog");
  return readDir(dir)
    .map((f) => readEntry(dir, f))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProductBlogPost(productSlug: string, blogSlug: string): ContentEntry | null {
  const dir = path.join(CONTENT_DIR, "products", productSlug, "blog");
  const file = readDir(dir).find((f) => f.replace(/\.mdx?$/, "") === blogSlug);
  return file ? readEntry(dir, file) : null;
}

// ---------- Legal pages ----------
export function getLegalDoc(slug: string): ContentEntry | null {
  const dir = path.join(CONTENT_DIR, "legal");
  const file = readDir(dir).find((f) => f.replace(/\.mdx?$/, "") === slug);
  return file ? readEntry(dir, file) : null;
}

// ---------- Static marketing pages (about, etc.) ----------
export function getPageDoc(slug: string): ContentEntry | null {
  const dir = path.join(CONTENT_DIR, "pages");
  const file = readDir(dir).find((f) => f.replace(/\.mdx?$/, "") === slug);
  return file ? readEntry(dir, file) : null;
}
