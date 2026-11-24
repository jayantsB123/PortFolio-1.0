import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BROWSER_TAB_STYLES, resolveBrowserTabConfig } from "../src/v2/config/setenv.js";

test("circuit trace is the default browser tab identity", () => {
  assert.deepEqual(BROWSER_TAB_STYLES, ["signature", "monogram", "terminal", "orbit", "circuit"]);
  assert.deepEqual(resolveBrowserTabConfig(), {
    style: "circuit",
    title: "Jayant Singh | SDE · FinTech",
  });
});

test("each tab style has its own title and favicon asset", () => {
  const expected = {
    signature: "Jayant Singh | Backend Engineer",
    monogram: "Jayant Bhadauria | Software Engineer",
    terminal: "jayant@backend ~ portfolio",
    orbit: "Jayant Singh | Distributed Systems",
    circuit: "Jayant Singh | SDE · FinTech",
  };

  for (const style of BROWSER_TAB_STYLES) {
    assert.equal(resolveBrowserTabConfig({ VITE_BROWSER_TAB_STYLE: style }).title, expected[style]);
    const asset = readFileSync(new URL("../public/favicons/" + style + ".svg", import.meta.url), "utf8");
    assert.match(asset, /<svg\b/);
    assert.match(asset, /viewBox="0 0 64 64"/);
  }
});

test("unknown styles use circuit; a custom title overrides only the title", () => {
  assert.equal(resolveBrowserTabConfig({ VITE_BROWSER_TAB_STYLE: "invalid" }).style, "circuit");
  assert.deepEqual(
    resolveBrowserTabConfig({
      VITE_BROWSER_TAB_STYLE: "orbit",
      VITE_BROWSER_TAB_TITLE: "  My portfolio  ",
    }),
    { style: "orbit", title: "My portfolio" }
  );
  assert.equal(
    resolveBrowserTabConfig({
      VITE_BROWSER_TAB_STYLE: "signature",
      VITE_BROWSER_TAB_TITLE: "   ",
    }).title,
    "Jayant Singh | Backend Engineer"
  );
});
