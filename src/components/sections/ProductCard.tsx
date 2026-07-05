import { ArrowRight, SearchCheck, Puzzle, Boxes } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ForceNavLink } from "@/components/layout/ForceNavLink";
import type { Product } from "@/config/products";

const iconMap = {
  SearchCheck,
  Puzzle,
  Boxes,
  Github: GithubIcon,
};

export function ProductCard({ product }: { product: Product }) {
  const Icon = iconMap[product.icon as keyof typeof iconMap] ?? Boxes;

  return (
    <ForceNavLink
      href={`/products/${product.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:-translate-y-0.5"
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${product.color}1a`, color: product.color }}
      >
        <Icon size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{product.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {product.shortDescription}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Learn more
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </span>
    </ForceNavLink>
  );
}
