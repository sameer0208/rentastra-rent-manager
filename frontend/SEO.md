# SEO Setup for RentAstra

This project is configured for search engine optimization (SEO). Follow these steps to get the best results.

## 1. Set your production URL

In `.env` (or your deployment environment), set:

```
VITE_SITE_URL=https://yourdomain.com
```

This is used for canonical URLs, Open Graph tags, and structured data. If not set, the default is `https://rentastra.com`.

## 2. Update static files when using a different domain

If your live site is **not** at `https://rentastra.com`, update the domain in:

- **`index.html`** – `canonical`, `og:url`, `og:image`, `twitter:url`, `twitter:image`
- **`public/robots.txt`** – `Sitemap:` URL
- **`public/sitemap.xml`** – every `<loc>` URL

Replace `https://rentastra.com` with your actual base URL (e.g. `https://www.yourapp.com`).

## 3. Add images for social sharing

- **Favicon:** Place a `favicon.png` (or `.ico`) in `public/` and reference it in `index.html` as `/favicon.png`. The app currently uses the logo from assets; you can keep it or switch to a dedicated favicon.
- **Open Graph / Twitter:** Add an image (e.g. 1200×630 px) as `public/og-image.png`. It will be used when your site is shared on social media. Update `index.html` and `src/config/seo.js` if you use a different path or filename.

## 4. Submit to search engines

- **Google:** [Google Search Console](https://search.google.com/search-console) – add your property and submit `https://yourdomain.com/sitemap.xml`.
- **Bing:** [Bing Webmaster Tools](https://www.bing.com/webmasters) – add your site and submit the same sitemap.

## What’s already in place

- **Meta tags:** Title, description, keywords, author, robots in `index.html`; per-page title and description via `react-helmet-async` and the `SEO` component.
- **Open Graph & Twitter Cards:** Default and per-page OG/Twitter meta for sharing.
- **Canonical URLs:** Set per page to avoid duplicate content.
- **Structured data (JSON-LD):** `WebSite` and `Organization` on the homepage for rich results.
- **Semantic HTML:** One `<h1>` per page, `<main>`, `<header>`, `<footer>`, `<nav>`, sections with headings, and a “Skip to content” link.
- **robots.txt:** Allows crawling of public pages; disallows authenticated app routes.
- **sitemap.xml:** Lists public URLs for indexing.
- **Accessibility:** Skip link, ARIA where needed, descriptive image alt text.

## Optional: pre-rendering or SSR

For even stronger SEO (e.g. for very content-heavy or blog-heavy sites), consider pre-rendering (e.g. Vite plugin) or server-side rendering (e.g. React with a Node/SSR setup) so crawlers receive full HTML without relying on JavaScript. The current setup is suitable for most SPAs and is fully crawlable by Google.
