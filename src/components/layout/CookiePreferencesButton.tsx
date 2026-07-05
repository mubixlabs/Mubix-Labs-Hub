"use client";

import { openCookiePreferences } from "./CookieConsent";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      Cookie Preferences
    </button>
  );
}
