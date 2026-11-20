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

test("configured intro defaults use valid supported values", () => {
  const defaults = resolvePortfolioLoaderConfig();
  assert.deepEqual(portfolioLoaderConfig, defaults);
  assert.ok([...PORTFOLIO_LOADER_STYLES, "random", "cycle", "sequence", "off"].includes(defaults.mode));
  assert.ok(defaults.durationMs >= 750 && defaults.durationMs <= 4000);
  assert.ok(defaults.exitMs >= 150 && defaults.exitMs <= 950);
  assert.ok(["session", "always"].includes(defaults.replay));
  assert.equal(typeof defaults.skipEnabled, "boolean");
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
  assert.equal(value.replay, resolvePortfolioLoaderConfig().replay);
  assert.equal(value.skipEnabled, resolvePortfolioLoaderConfig().skipEnabled);
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
  assert.equal(invalid.exitMs, resolvePortfolioLoaderConfig().exitMs);
});
