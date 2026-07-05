"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import Link from "next/link";
import { Settings2 } from "lucide-react";

const CONSENT_COOKIE = "mubixlabs_cookie_consent_v2";
export const CONSENT_CHANGE_EVENT = "mubixlabs-consent-change";

export type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
};

const DEFAULT_CONSENT: ConsentCategories = { analytics: false, marketing: false };

function readConsent(): ConsentCategories | null {
  // Cookie is the primary source of truth. localStorage is a redundant
  // backup — if for any reason the cookie write/read fails in a given
  // browser/environment, we still won't show the banner again once a
  // choice has been made.
  const raw = Cookies.get(CONSENT_COOKIE) ?? safeLocalStorageGet(CONSENT_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ConsentCategories;
  } catch {
    return null;
  }
}

function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore (e.g. private browsing mode blocking storage)
  }
}

function writeConsent(value: ConsentCategories) {
  const serialized = JSON.stringify(value);
  Cookies.set(CONSENT_COOKIE, serialized, { expires: 365, sameSite: "lax", path: "/" });
  safeLocalStorageSet(CONSENT_COOKIE, serialized);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }));
}

export function getStoredConsent(): ConsentCategories {
  return readConsent() ?? DEFAULT_CONSENT;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<ConsentCategories>(DEFAULT_CONSENT);

  useEffect(() => {
    const existing = readConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of client-only cookie storage on mount, not a render-driven update
    if (!existing) setVisible(true);

    function handleReopen() {
      setDraft(getStoredConsent());
      setVisible(true);
      setCustomizing(true);
    }
    window.addEventListener("mubixlabs-open-cookie-prefs", handleReopen);
    return () => window.removeEventListener("mubixlabs-open-cookie-prefs", handleReopen);
  }, []);

  function saveAndClose(value: ConsentCategories) {
    writeConsent(value);
    setVisible(false);
    setCustomizing(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-2xl rounded-2xl border border-border bg-card p-4 shadow-2xl sm:p-5"
        >
          {!customizing ? (
            <>
              <p className="text-sm text-foreground">
                We use strictly necessary cookies to run this site, and optional analytics and
                marketing cookies to understand site usage and show more relevant ads. See our{" "}
                <Link prefetch={false} href="/cookie-policy" className="text-primary underline underline-offset-2">
                  Cookie Policy
                </Link>{" "}
                for details.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => saveAndClose({ analytics: true, marketing: true })}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Accept All
                </button>
                <button
                  onClick={() => saveAndClose({ analytics: false, marketing: false })}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={() => {
                    setDraft(getStoredConsent());
                    setCustomizing(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings2 size={15} />
                  Customize
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground">Cookie Preferences</p>

              <div className="mt-3 space-y-3">
                <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Strictly Necessary</p>
                    <p className="text-xs text-muted-foreground">
                      Required for the site to function. Always on.
                    </p>
                  </div>
                  <span className="mt-0.5 shrink-0 text-xs font-medium text-muted-foreground">
                    Always on
                  </span>
                </div>

                <label className="flex items-start justify-between gap-4 rounded-lg border border-border p-3 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-foreground">Analytics</p>
                    <p className="text-xs text-muted-foreground">
                      Helps us understand how visitors use the site.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.analytics}
                    onChange={(e) => setDraft((d) => ({ ...d, analytics: e.target.checked }))}
                    className="mt-1 h-4 w-4 shrink-0 accent-primary"
                  />
                </label>

                <label className="flex items-start justify-between gap-4 rounded-lg border border-border p-3 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-foreground">Marketing &amp; Advertising</p>
                    <p className="text-xs text-muted-foreground">
                      Used for ad measurement and retargeting via Google Ads and Meta Pixel.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.marketing}
                    onChange={(e) => setDraft((d) => ({ ...d, marketing: e.target.checked }))}
                    className="mt-1 h-4 w-4 shrink-0 accent-primary"
                  />
                </label>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => saveAndClose(draft)}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setCustomizing(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Exposed so the footer "Cookie Preferences" link can reopen the banner
export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent("mubixlabs-open-cookie-prefs"));
}
