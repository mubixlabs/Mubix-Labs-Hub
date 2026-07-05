"use client";

import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode, MouseEvent } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

/**
 * A handful of links on this site (docs cards, product cards, hero CTA
 * buttons) kept hitting a known Next.js App Router bug: after a browser
 * back/forward navigation, the first click on a <Link> to a page already in
 * the router's internal cache is silently swallowed -- nothing happens
 * until a second click. Disabling prefetch and tuning staleTimes reduced
 * it but didn't fully eliminate it on this Next.js version.
 *
 * This component sidesteps the bug entirely: instead of relying on
 * next/link's internal click interception (which is what gets stuck),
 * it renders a plain anchor and calls router.push() imperatively on every
 * plain left-click, with no dependency on any cached internal Link state.
 * Modifier-key clicks (Ctrl/Cmd/Shift/middle-click) are left untouched so
 * "open in new tab" still works exactly like a normal link.
 */
export function ForceNavLink({ href, children, onClick, ...props }: Props) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let the browser handle new-tab / new-window clicks natively.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    router.push(href);
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
