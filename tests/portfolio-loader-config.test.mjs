import test from "node:test";
import assert from "node:assert/strict";
import {
  PORTFOLIO_LOADER_STYLES,
  portfolioLoaderConfig,
  resolvePortfolioLoaderConfig,
} from "../src/v2/config/setenv.js";

test("all four intended intro styles are available (no counter curtain)", () => {
  assert.deepEqual(PORTFOLIO_LOADER_STYLES, ["system", "type", "ignition", "commit"]);
  assert.equal(PORTFOLIO_LOADER_STYLES.includes("counter"), false);
  assert.deepEqual(
    ["system", "type", "ignition", "commit"].map((mode) =>
      resolvePortfolioLoaderConfig({ VITE_PORTFOLIO_LOADER_STYLE: mode }).mode
    ), PORTFOLIO_LOADER_STYLES
  );
});

test("default intro is brief, skippable and once per browser session", () => {
  assert.deepEqual(resolvePortfolioLoaderConfig(), {
    mode: "cycle",
    durationMs: 3650,
    exitMs: 440,
    replay: "session",
    skipEnabled: true,
  });
  assert.deepEqual(portfolioLoaderConfig, resolvePortfolioLoaderConfig());
});

test("random, cycle, sequence and off are supported", () => {
  for (const mode of ["random", "cycle", "sequence", "off"]) {
    assert.equal(resolvePortfolioLoaderConfig({
      VITE_PORTFOLIO_LOADER_STYLE: mode
    }).mode, mode);
  }
});

test("invalid styles and replay values fall back safely", () => {
  const value = resolvePortfolioLoaderConfig({
    VITE_PORTFOLIO_LOADER_STYLE: "counter",
    VITE_PORTFOLIO_LOADER_REPLAY: "on every click",
    VITE_PORTFOLIO_LOADER_SKIPPABLE: "maybe",
  });
  assert.equal(value.mode, resolvePortfolioLoaderConfig().mode);
  assert.equal(value.replay, "session");
  assert.equal(value.skipEnabled, true);
});

test("duration and exit values clamp to non-annoying bounds", () => {
  assert.deepEqual(resolvePortfolioLoaderConfig({
    VITE_PORTFOLIO_LOADER_DURATION_MS: "10",
    VITE_PORTFOLIO_LOADER_EXIT_MS: "5000",
    VITE_PORTFOLIO_LOADER_REPLAY: "always",
    VITE_PORTFOLIO_LOADER_SKIPPABLE: "false",
  }), {
    mode: resolvePortfolioLoaderConfig().mode,
    durationMs: 750,
    exitMs: 950,
    replay: "always",
    skipEnabled: false,
  });
  const invalid = resolvePortfolioLoaderConfig({
    VITE_PORTFOLIO_LOADER_DURATION_MS: "nope",
    VITE_PORTFOLIO_LOADER_EXIT_MS: "",
  });
  assert.equal(invalid.durationMs, resolvePortfolioLoaderConfig().durationMs);
  assert.equal(invalid.exitMs, 440);
});
