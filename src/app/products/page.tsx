import type { Metadata } from "next";
import { ProductCard } from "@/components/sections/ProductCard";
import { getActiveProducts } from "@/config/products";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Products",
  description: `Explore developer tools built by ${siteConfig.name} VS Code extensions, Chrome extensions, and micro SaaS products.`,
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const products = getActiveProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Products</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every tool we build is designed to live where developers already work, not in a
        separate browser tab.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
