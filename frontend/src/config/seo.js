/**
 * SEO config – set VITE_SITE_URL in .env to your production URL (e.g. https://rentastra.com)
 * Used for canonical URLs, Open Graph, and sitemap.
 */
export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://rentastra.com";
export const SITE_NAME = "RentAstra";
export const DEFAULT_DESCRIPTION =
  "Manage tenants, rent payments, receipts, and documents in one place. RentAstra helps landlords and property managers track guests, rooms, payments, and compliance. Free to start.";
