import { notFound } from "next/navigation";
import { NavLink } from "@/components/layout/NavLink";
import type { Metadata } from "next";
import { getProductBySlug, products } from "@/config/products";

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
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: "website",
    },
  };
}

const subNav = (slug: string) => [
  { href: `/products/${slug}`, label: "Overview" },
  { href: `/products/${slug}/pricing`, label: "Pricing" },
  { href: `/products/${slug}/docs`, label: "Docs" },
  { href: `/products/${slug}/blog`, label: "Blog" },
];

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div>
      <div className="border-b border-border bg-card/40">
        <nav
          aria-label={`${product.name} navigation`}
          className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 sm:px-6 py-3 scrollbar-none"
        >
          {subNav(product.slug).map((item) => (
            <NavLink prefetch={false}
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
