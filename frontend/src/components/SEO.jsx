import { Helmet } from "react-helmet-async";
import { SITE_URL, SITE_NAME } from "../config/seo";

/**
 * Per-page SEO: title, description, canonical, Open Graph, Twitter.
 * Use on every public page for better search and share previews.
 */
export default function SEO({
  title,
  description,
  path = "",
  image = `${SITE_URL}/og-image.png`,
  noindex = false,
}) {
  const canonical = path ? `${SITE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}` : SITE_URL;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
