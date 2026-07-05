"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { NavLink } from "./NavLink";
import { MobileSidebar } from "./MobileSidebar";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink prefetch={false}
          href="/"
          className="flex items-center gap-2 font-bold text-base sm:text-lg tracking-tight text-foreground shrink-0"
          aria-label={`${siteConfig.shortName} Labs | Home`}
        >
          <Image
            src="/header-mark.png"
            alt=""
            width={30}
            height={30}
            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 object-contain"
            priority
          />
          <span className="truncate">{siteConfig.shortName} Labs</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink prefetch={false}
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <NavLink prefetch={false}
            href="/products/seo-insight-engine/pricing"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Get Started
          </NavLink>
        </div>

        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="md:hidden flex items-center justify-center rounded-md p-2 -mr-2 text-foreground hover:bg-muted transition-colors shrink-0"
        >
          <Menu size={22} />
        </button>
      </div>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  );
}
