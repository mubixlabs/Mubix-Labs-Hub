"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getStoredConsent, CONSENT_CHANGE_EVENT, type ConsentCategories } from "./CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Renders third-party tracking scripts only once the user has opted in.
 * - GA4 loads if `analytics` OR `marketing` is accepted (GA is used for both site analytics
 *   and, when linked to Google Ads, conversion/remarketing).
 * - Google Ads tag and Meta Pixel load only if `marketing` is accepted.
 * Scripts are added on the fly (not just hidden) so nothing fires before consent is given,
 * and re-evaluate live if the user changes their preferences via the footer link.
 */
export function MarketingScripts() {
  const [consent, setConsent] = useState<ConsentCategories>({ analytics: false, marketing: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of client-only cookie storage on mount
    setConsent(getStoredConsent());

    function handleChange(e: Event) {
      const detail = (e as CustomEvent<ConsentCategories>).detail;
      if (detail) setConsent(detail);
    }
    window.addEventListener(CONSENT_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handleChange);
  }, []);

  const analyticsAllowed = consent.analytics || consent.marketing;
  const marketingAllowed = consent.marketing;

  return (
    <>
      {analyticsAllowed && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
              ${
                marketingAllowed && GOOGLE_ADS_ID
                  ? `gtag('config', '${GOOGLE_ADS_ID}');`
                  : ""
              }
            `}
          </Script>
        </>
      )}

      {marketingAllowed && META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
