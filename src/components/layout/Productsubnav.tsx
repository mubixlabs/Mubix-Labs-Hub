"use client";

import { usePathname } from "next/navigation";
import { NavLink } from "@/components/layout/NavLink";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
};

export function ProductSubNav({ slug }: Props) {
  const pathname = usePathname();

  const items = [
    { href: `/products/${slug}`, label: "Overview" },
    { href: `/products/${slug}/pricing`, label: "Pricing" },
    { href: `/products/${slug}/docs`, label: "Docs" },
    { href: `/products/${slug}/blog`, label: "Blog" },
  ];

  return (
    <nav
      aria-label="Product navigation"
      className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 sm:px-6 py-3 scrollbar-none"
    >
      {items.map((item) => {
        // Overview is the base product page - only exact match counts as active,
        // otherwise it would stay highlighted on every sub-page too.
        const isOverview = item.href === `/products/${slug}`;
        const isActive = isOverview ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <NavLink
            key={item.href}
            href={item.href}
            prefetch={false}
            className={cn(
              "relative whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {item.label}
            {isActive && (
              <span className="absolute inset-x-2 -bottom-[13px] h-[2px] rounded-full bg-primary" />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
