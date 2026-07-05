import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLegalDoc } from "@/lib/mdx";
import { MDXContent } from "@/components/seo/MDXContent";

export async function generateMetadata(): Promise<Metadata> {
  const doc = getLegalDoc("terms-of-service");
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: "/terms-of-service" },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  const doc = getLegalDoc("terms-of-service");
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">{doc.title}</h1>
      <div className="mt-8">
        <MDXContent source={doc.content} />
      </div>
    </div>
  );
}
