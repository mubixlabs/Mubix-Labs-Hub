"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { PricingTier } from "@/config/products";

export function PricingTiers({ tiers }: { tiers: PricingTier[] }) {
  const defaultSelected = tiers.find((t) => t.highlighted)?.id ?? tiers[0]?.id;
  const [selectedId, setSelectedId] = useState(defaultSelected);

  return (
    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {tiers.map((tier) => {
        const isSelected = tier.id === selectedId;

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => setSelectedId(tier.id)}
            className={cn(
              "group flex flex-col rounded-2xl border p-6 text-left transition-colors duration-200 cursor-pointer",
              "hover:border-primary focus-visible:border-primary",
              isSelected ? "border-primary bg-card ring-1 ring-primary" : "border-border bg-card"
            )}
          >
            {tier.highlighted && (
              <span className="mb-3 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(tier.price.monthly)}
              </span>
              {tier.price.monthly !== null && tier.price.monthly > 0 && (
                <span className="text-sm text-muted-foreground">
                  /mo {tier.price.unit ? `(${tier.price.unit})` : ""}
                </span>
              )}
            </div>
            {tier.price.yearly !== null && tier.price.yearly > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">or ${tier.price.yearly}/year</p>
            )}
            {tier.minSeats && (
              <p className="mt-1 text-xs text-muted-foreground">Minimum {tier.minSeats} seats</p>
            )}
            <p className="mt-3 text-sm text-muted-foreground">{tier.tagline}</p>

            <a
              href={tier.ctaHref}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "mt-6 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-opacity hover:opacity-90",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground"
              )}
            >
              {tier.cta}
            </a>

            <ul className="mt-6 flex-1 space-y-2.5">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={15} className="mt-0.5 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}
