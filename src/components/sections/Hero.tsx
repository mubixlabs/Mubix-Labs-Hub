"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ForceNavLink } from "@/components/layout/ForceNavLink";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Subtle background glow - purely decorative, aria-hidden */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          Built by developers, for developers
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          Tools that remove <span className="text-primary">friction</span> from your workflow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          Mubix Labs builds VS Code extensions, Chrome extensions, and micro SaaS products
          designed to live where you already work not in another browser tab.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <ForceNavLink
            href="/products/seo-insight-engine"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
          >
            Explore SEO Insight Engine
            <ArrowRight size={16} />
          </ForceNavLink>
          <ForceNavLink
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors w-full sm:w-auto justify-center"
          >
            View all products
          </ForceNavLink>
        </motion.div>
      </div>
    </section>
  );
}
