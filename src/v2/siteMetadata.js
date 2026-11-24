import { resolveBrowserTabConfig } from "./config/setenv.js";

export function resolveSiteUrl(value) {
  if (!value || !String(value).trim()) return null;
  try {
    const url = new URL(String(value).trim());
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return null;
    if (!url.pathname.endsWith("/")) url.pathname += "/";
    return url.href;
  } catch {
    return null;
  }
}

const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
);

export function portfolioMetadata(html, env = {}, base = "/") {
  const tab = resolveBrowserTabConfig(env);
  const updated = html
    .replace(/<title>[\s\S]*?<\/title>/, () => "<title>" + escapeHtml(tab.title) + "</title>")
    .replace(/<link rel="icon"[^>]*\/?>/, () =>
      '<link rel="icon" type="image/svg+xml" href="' + escapeHtml(base + "favicons/" + tab.style + ".svg") + '" />'
    );

  const siteUrl = resolveSiteUrl(env.VITE_PORTFOLIO_SITE_URL);
  if (!siteUrl) return { html: updated, tags: [] };
  const imageUrl = new URL("social-card.png", siteUrl).href;
  const description = "Backend engineering for fintech, distributed systems, payment reconciliation and Digital Rupee infrastructure.";
  const title = "Jayant Singh Bhadauria — Backend & FinTech Software Engineer";
  const og = (property, content) => ({ tag: "meta", attrs: { property, content }, injectTo: "head" });
  const twitter = (name, content) => ({ tag: "meta", attrs: { name, content }, injectTo: "head" });

  return {
    html: updated,
    tags: [
      { tag: "link", attrs: { rel: "canonical", href: siteUrl }, injectTo: "head" },
      og("og:url", siteUrl),
      og("og:image", imageUrl),
      og("og:image:width", "1200"),
      og("og:image:height", "630"),
      og("og:image:alt", "Jayant Singh Bhadauria — Software Development Engineer"),
      twitter("twitter:card", "summary_large_image"),
      twitter("twitter:title", title),
      twitter("twitter:description", description),
      twitter("twitter:image", imageUrl),
    ],
  };
}
