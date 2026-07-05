"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type NavLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

/**
 * Behaves exactly like next/link, except: if the link points to the page
 * you're already on, clicking it smooth-scrolls to the top instead of doing
 * nothing (which is Next.js's default behavior for same-route navigation).
 */
export function NavLink({ href, onClick, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const targetPath = typeof href === "string" ? href.split("?")[0].split("#")[0] : href.pathname;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (targetPath === pathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    onClick?.(e);
  }

  return (
    <Link prefetch={false} href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
