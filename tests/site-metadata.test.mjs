import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { portfolioMetadata, resolveSiteUrl, resolveDeploymentSiteUrl, siteIndexFiles } from "../src/v2/siteMetadata.js";

const template = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("the static HTML uses the selected favicon and escapes custom titles", () => {
  const { html, tags } = portfolioMetadata(template, {
    VITE_BROWSER_TAB_STYLE: "orbit",
    VITE_BROWSER_TAB_TITLE: "A & B <developer>",
  });
  assert.match(html, /<title>A &amp; B &lt;developer&gt;<\/title>/);
  assert.match(html, /href="\/favicons\/orbit.svg"/);
  assert.equal(tags.length, 0);
});

test("social sharing uses absolute URLs only when a deployment URL is set", () => {
  assert.equal(resolveSiteUrl("https://example.com/portfolio"), "https://example.com/portfolio/");
  for (const invalid of ["", "example.com", "http://example.com", "https://user@example.com", "https://example.com/?x=1"]) {
    assert.equal(resolveSiteUrl(invalid), null);
  }
  const { tags } = portfolioMetadata(template, { VITE_PORTFOLIO_SITE_URL: "https://example.com/portfolio" });
  assert.equal(tags.find(t => t.attrs.rel === "canonical").attrs.href, "https://example.com/portfolio/");
  assert.equal(tags.find(t => t.attrs.property === "og:image").attrs.content, "https://example.com/portfolio/social-card.png");
  assert.equal(tags.find(t => t.attrs.name === "twitter:card").attrs.content, "summary_large_image");
});

test("the social card is a 1200 by 630 PNG", () => {
  const png = readFileSync(new URL("../public/social-card.png", import.meta.url));
  assert.equal(png.toString("hex", 0, 8), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test("Netlify production uses the primary URL unless it is explicitly overridden", () => {
  const build = { NETLIFY: "true", CONTEXT: "production", URL: "https://example.netlify.app" };
  assert.equal(resolveDeploymentSiteUrl({}, build), "https://example.netlify.app/");
  assert.equal(resolveDeploymentSiteUrl({ VITE_PORTFOLIO_SITE_URL: "" }, build), "https://example.netlify.app/");
  assert.equal(resolveDeploymentSiteUrl({ VITE_PORTFOLIO_SITE_URL: "https://example.com" }, build), "https://example.com/");
  assert.equal(resolveDeploymentSiteUrl({ VITE_PORTFOLIO_SITE_URL: "not-a-url" }, build), null);
  assert.equal(resolveDeploymentSiteUrl({}, { URL: "https://example.com" }), null);
});

test("Netlify previews do not advertise a production sitemap or canonical URL", () => {
  for (const CONTEXT of ["deploy-preview", "branch-deploy", "dev"]) {
    const build = { NETLIFY: "true", CONTEXT, URL: "https://example.netlify.app" };
    const url = resolveDeploymentSiteUrl({ VITE_PORTFOLIO_SITE_URL: "https://example.com" }, build);
    assert.equal(url, null);
    assert.deepEqual(siteIndexFiles(url), []);
  }
});

test("the production index contains the canonical address and sitemap link", () => {
  const files = siteIndexFiles("https://example.com");
  assert.equal(files.length, 2);
  assert.match(files.find(f => f.fileName === "robots.txt").source, /Sitemap: https:\/\/example\.com\/sitemap\.xml/);
  assert.match(files.find(f => f.fileName === "sitemap.xml").source, /<loc>https:\/\/example\.com\/<\/loc>/);
  assert.deepEqual(siteIndexFiles("http://example.com"), []);
});
