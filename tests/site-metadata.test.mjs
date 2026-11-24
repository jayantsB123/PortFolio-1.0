import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { portfolioMetadata, resolveSiteUrl } from "../src/v2/siteMetadata.js";

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
