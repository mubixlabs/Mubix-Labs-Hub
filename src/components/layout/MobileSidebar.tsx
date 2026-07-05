"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { GithubIcon, XSocialIcon } from "@/components/ui/BrandIcons";
import { useClickOutside } from "@/hooks/useClickOutside";
import { siteConfig } from "@/config/site";
import { getActiveProducts } from "@/config/products";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileSidebar({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useClickOutside(panelRef, onClose, open);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  const products = getActiveProducts();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            style={{ backgroundColor: "#14181F" }}
            className="fixed inset-y-0 right-0 z-50 flex h-[100dvh] w-[84%] max-w-sm flex-col border-l-2 border-primary/30 shadow-2xl md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
          >
            {/* Header */}
            <div
              style={{ backgroundColor: "#0E1116" }}
              className="flex items-center justify-between px-5 py-4 border-b border-primary/20 shrink-0"
            >
              <span className="font-bold text-foreground tracking-tight">
              Menu
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-white/5 active:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav content - fills all remaining height */}
            <nav className="flex-1 overflow-y-auto px-4 py-5">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <li key={link.href}>
                      <NavLink prefetch={false}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center rounded-lg px-4 py-3.5 text-base font-semibold transition-colors",
                          isActive
                            ? "bg-primary/15 text-primary"
                            : "text-foreground hover:bg-white/5 active:bg-primary/10 active:text-primary"
                        )}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              {products.length > 0 && (
                <div className="mt-8">
                  <p className="px-4 text-xs font-bold uppercase tracking-wider text-primary/80">
                    Products
                  </p>
                  <ul className="mt-3 flex flex-col gap-1">
                    {products.map((p) => {
                      const isActive = pathname.startsWith(`/products/${p.slug}`);
                      return (
                        <li key={p.slug}>
                          <NavLink prefetch={false}
                            href={`/products/${p.slug}`}
                            onClick={onClose}
                            className={cn(
                              "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-primary/15 text-primary"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground active:bg-primary/10 active:text-primary"
                            )}
                          >
                            {p.name}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="mt-8 px-4">
                <NavLink prefetch={false}
                  href="/products/seo-insight-engine/pricing"
                  onClick={onClose}
                  className="flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 active:opacity-80 transition-opacity"
                >
                  Get Started
                </NavLink>
              </div>
            </nav>

            {/* Footer - social links, pinned to bottom via flex-1 on nav above */}
            <div
              style={{ backgroundColor: "#0E1116" }}
              className="flex items-center gap-5 border-t border-primary/20 px-5 py-4 shrink-0"
            >
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-primary active:text-primary transition-colors"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-muted-foreground hover:text-primary active:text-primary transition-colors"
              >
                <XSocialIcon size={20} />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
