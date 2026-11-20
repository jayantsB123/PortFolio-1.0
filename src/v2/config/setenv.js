/**
 * Gravity Dots settings.
 *
 * Change the defaults below, or override them in a local .env file with:
 * VITE_GRAVITY_DOTS_ENERGY=74
 * VITE_GRAVITY_DOTS_RADIUS=225
 *
 * ENERGY: 0–100 (% of the reference playground's effect strength).
 * RADIUS: 60–480 (CSS pixels around the cursor).
 * Both are read at Vite build time; restart the dev server after editing .env.
 */

const DEFAULTS = Object.freeze({
  energy: 74,
  radius: 225,
});

function numberInRange(value, fallback, min, max) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return fallback;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? Math.max(min, Math.min(max, numeric))
    : fallback;
}

export function resolveGravityDotsConfig(env = {}) {
  return Object.freeze({
    energy: numberInRange(env.VITE_GRAVITY_DOTS_ENERGY, DEFAULTS.energy, 0, 100),
    radius: numberInRange(env.VITE_GRAVITY_DOTS_RADIUS, DEFAULTS.radius, 60, 480),
  });
}

export const gravityDotsConfig = resolveGravityDotsConfig(import.meta.env ?? {});

/**
 * Portfolio opening loader.
 *
 * Four named styles, all available without adding dependencies:
 *  - system: terminal-style System Boot
 *  - type: typographic Type Assembly
 *  - ignition: orbital Engine Ignition
 *  - commit: Git-inspired Commit Sequence
 *
 * Extra modes:
 *  - random: choose one of the four on each eligible visit
 *  - cycle: rotate through all four on repeat visits
 *  - sequence: play all four in order (long; intentionally opt-in)
 *  - off: disable the intro
 *
 * Env overrides are read at Vite build time. Restart npm run dev to apply.
 */
export const PORTFOLIO_LOADER_STYLES = Object.freeze([
  "system",
  "type",
  "ignition",
  "commit",
]);

const LOADER_MODES = Object.freeze([
  ...PORTFOLIO_LOADER_STYLES,
  "random",
  "cycle",
  "sequence",
  "off",
]);

const LOADER_DEFAULTS = Object.freeze({
  mode: "ignition",
  durationMs: 1650,
  exitMs: 440,
  replay: "session",
  skipEnabled: true,
});

function stringChoice(input, choices, fallback) {
  const normalized = String(input ?? "").toLowerCase().trim();
  return choices.includes(normalized) ? normalized : fallback;
}

function boolChoice(input, fallback) {
  if (input === undefined || input === null || String(input).trim() === "") return fallback;
  const value = String(input).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(value)) return true;
  if (["0", "false", "no", "off"].includes(value)) return false;
  return fallback;
}

export function resolvePortfolioLoaderConfig(env = {}) {
  return Object.freeze({
    mode: stringChoice(env.VITE_PORTFOLIO_LOADER_STYLE, LOADER_MODES, LOADER_DEFAULTS.mode),
    durationMs: numberInRange(
      env.VITE_PORTFOLIO_LOADER_DURATION_MS,
      LOADER_DEFAULTS.durationMs, 750, 4000
    ),
    exitMs: numberInRange(
      env.VITE_PORTFOLIO_LOADER_EXIT_MS,
      LOADER_DEFAULTS.exitMs, 150, 950
    ),
    replay: stringChoice(
      env.VITE_PORTFOLIO_LOADER_REPLAY,
      ["session", "always"], LOADER_DEFAULTS.replay
    ),
    skipEnabled: boolChoice(
      env.VITE_PORTFOLIO_LOADER_SKIPPABLE,
      LOADER_DEFAULTS.skipEnabled
    ),
  });
}

export const portfolioLoaderConfig = resolvePortfolioLoaderConfig(import.meta.env ?? {});

