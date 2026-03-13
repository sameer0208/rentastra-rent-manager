/**
 * Google Analytics (GA4) helpers.
 * Set VITE_GA_MEASUREMENT_ID in .env to override (e.g. G-XXXXXXXXXX).
 * Events are no-op if gtag is not loaded.
 */
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-J89MCDCNV9";

export function getGAId() {
  return GA_ID;
}

export function trackEvent(eventName, eventParams = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  }
}

export function trackPageView(pagePath) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_ID, { page_path: pagePath });
  }
}
