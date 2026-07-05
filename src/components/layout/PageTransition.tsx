"use client";

import { usePathname } from "next/navigation";

/**
 * Deliberately simple: a plain CSS @keyframes animation (defined in
 * globals.css as `.page-fade-in`), re-triggered by giving the wrapper a new
 * `key` on every pathname change so React remounts the DOM node.
 *
 * Why not framer-motion / AnimatePresence here: a JS-driven animation state
 * machine has to wait for React to hydrate and run an effect before it can
 * apply the "invisible" starting state — on fast static pages the browser
 * often paints the new page BEFORE that JS state applies, causing a visible
 * "flash of full content, then a weird animate" glitch. It can also race
 * with rapid/repeated clicks (mode="wait" exit-sequencing getting confused),
 * which caused clicks to silently do nothing until a 2nd or 3rd try.
 *
 * A CSS @keyframes animation has none of these problems: the browser starts
 * it in the same paint as the element being inserted, guaranteed, with zero
 * JS state to get out of sync — and it can never block or delay a click.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-fade-in">
      {children}
    </div>
  );
}
