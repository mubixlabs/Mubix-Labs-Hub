"use client";

import { useEffect } from "react";

/**
 * CSS `<link media="...">` based favicon switching only gets evaluated by
 * most browsers ONCE, when the page loads — if the user changes their
 * OS/browser theme while the tab stays open, the favicon doesn't update
 * until a reload. This component fixes that by watching the live media
 * query and swapping the favicon href immediately, no reload needed.
 */
export function FaviconSwitcher() {
  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyFavicon(isDark: boolean) {
      const iconHref = isDark ? "/favicon-dark.ico" : "/favicon-light.ico";
      const pngHref = isDark ? "/icon-dark.png" : "/icon-light.png";

      let iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-favicon-ico]');
      if (!iconLink) {
        iconLink = document.createElement("link");
        iconLink.rel = "icon";
        iconLink.setAttribute("data-favicon-ico", "true");
        document.head.appendChild(iconLink);
      }
      iconLink.href = `${iconHref}?v=3`;

      let pngLink = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-favicon-png]');
      if (!pngLink) {
        pngLink = document.createElement("link");
        pngLink.rel = "icon";
        pngLink.type = "image/png";
        pngLink.setAttribute("sizes", "192x192");
        pngLink.setAttribute("data-favicon-png", "true");
        document.head.appendChild(pngLink);
      }
      pngLink.href = `${pngHref}?v=3`;
    }

    applyFavicon(darkQuery.matches);

    function handleChange(e: MediaQueryListEvent) {
      applyFavicon(e.matches);
    }
    darkQuery.addEventListener("change", handleChange);
    return () => darkQuery.removeEventListener("change", handleChange);
  }, []);

  return null;
}
