import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ProductCard } from "@/components/sections/ProductCard";
import { getActiveProducts } from "@/config/products";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Developer Tools That Remove Friction`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const products = getActiveProducts();

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Our Products</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              One tool right now. More on the way.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div>
            <h3 className="font-semibold text-foreground">Local-first</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              If something can run on your machine instead of our servers, it does.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Honest pricing</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No hidden fees, no per-feature gotchas. What you see is what you pay.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Developer-respecting</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No nagging, no unsolicited marketing emails, no unnecessary data collection.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
