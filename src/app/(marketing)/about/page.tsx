import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageDoc } from "@/lib/mdx";
import { MDXContent } from "@/components/seo/MDXContent";

export async function generateMetadata(): Promise<Metadata> {
  const doc = getPageDoc("about");
  if (!doc) return {};
  return {
    title: "About",
    description: doc.description,
    alternates: { canonical: "/about" },
  };
}

export default function AboutPage() {
  const doc = getPageDoc("about");
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <div className="mt-2">
        <MDXContent source={doc.content} />
      </div>
    </div>
  );
}
