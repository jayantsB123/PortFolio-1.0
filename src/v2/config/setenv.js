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
  energy: 100,
  radius: 400,
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
  mode: "cycle",
  durationMs: 2650,
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

// Card hover: spotlight, tilt and magnetic labels.
const DEPTH_DEFAULTS = Object.freeze({
  enabled: true,
  tilt: 5.5,
  lift: 5,
  magnet: 8,
  magnetRadius: 135,
  radius: 350,
  spotlight: 0.19,
});

export function resolveDepthCardsConfig(env = {}) {
  return Object.freeze({
    enabled: boolChoice(env.VITE_DEPTH_CARDS_ENABLED, DEPTH_DEFAULTS.enabled),
    tilt: numberInRange(env.VITE_DEPTH_CARDS_TILT, DEPTH_DEFAULTS.tilt, 0, 11),
    lift: numberInRange(env.VITE_DEPTH_CARDS_LIFT, DEPTH_DEFAULTS.lift, 0, 12),
    magnet: numberInRange(env.VITE_DEPTH_CARDS_MAGNET, DEPTH_DEFAULTS.magnet, 0, 16),
    magnetRadius: numberInRange(env.VITE_DEPTH_CARDS_MAGNET_RADIUS, DEPTH_DEFAULTS.magnetRadius, 70, 250),
    radius: numberInRange(env.VITE_DEPTH_CARDS_SPOTLIGHT_RADIUS, DEPTH_DEFAULTS.radius, 180, 600),
    spotlight: numberInRange(env.VITE_DEPTH_CARDS_SPOTLIGHT_ALPHA, DEPTH_DEFAULTS.spotlight, 0, 0.4),
  });
}

export const depthCardsConfig = resolveDepthCardsConfig(import.meta.env ?? {});

export const CURSOR_BACKGROUND_STYLES = Object.freeze([
  "grid",
  "constellation",
  "ribbon",
  "pixel",
]);

const CURSOR_BACKGROUND_DEFAULTS = Object.freeze({
  mode: "cycle",
  intensity: 72,
  radius: 265,
  gridGap: 46,
  nodeGap: 84,
  trailMs: 1350,
  pixelSize: 16,
});

export function nextCursorBackgroundStyle(previous) {
  const index = CURSOR_BACKGROUND_STYLES.indexOf(previous);
  return CURSOR_BACKGROUND_STYLES[(index + 1) % CURSOR_BACKGROUND_STYLES.length];
}

export function resolveCursorBackgroundConfig(env = {}) {
  return Object.freeze({
    mode: stringChoice(
      env.VITE_CURSOR_BACKGROUND_STYLE,
      [...CURSOR_BACKGROUND_STYLES, "cycle", "off"],
      CURSOR_BACKGROUND_DEFAULTS.mode
    ),
    intensity: numberInRange(
      env.VITE_CURSOR_BACKGROUND_INTENSITY,
      CURSOR_BACKGROUND_DEFAULTS.intensity, 0, 100
    ) / 100,
    radius: numberInRange(
      env.VITE_CURSOR_BACKGROUND_RADIUS, CURSOR_BACKGROUND_DEFAULTS.radius, 120, 420
    ),
    gridGap: numberInRange(
      env.VITE_CURSOR_BACKGROUND_GRID_GAP, CURSOR_BACKGROUND_DEFAULTS.gridGap, 24, 100
    ),
    nodeGap: numberInRange(
      env.VITE_CURSOR_BACKGROUND_NODE_GAP, CURSOR_BACKGROUND_DEFAULTS.nodeGap, 50, 150
    ),
    trailMs: numberInRange(
      env.VITE_CURSOR_BACKGROUND_TRAIL_MS, CURSOR_BACKGROUND_DEFAULTS.trailMs, 400, 2600
    ),
    pixelSize: numberInRange(
      env.VITE_CURSOR_BACKGROUND_PIXEL_SIZE, CURSOR_BACKGROUND_DEFAULTS.pixelSize, 10, 32
    ),
  });
}

export const cursorBackgroundConfig = resolveCursorBackgroundConfig(import.meta.env ?? {});

const CINEMATIC_SCROLL_DEFAULTS = Object.freeze({
  enabled: true,
  strength: 100,
  travel: 104,
  rotate: 8,
  scale: 0.12,
  blur: 9,
  minOpacity: 0.15,
});

export function resolveCinematicScrollConfig(env = {}) {
  return Object.freeze({
    enabled: boolChoice(env.VITE_CINEMATIC_SCROLL_ENABLED, CINEMATIC_SCROLL_DEFAULTS.enabled),
    strength: numberInRange(env.VITE_CINEMATIC_SCROLL_STRENGTH, CINEMATIC_SCROLL_DEFAULTS.strength, 0, 100),
    travel: numberInRange(env.VITE_CINEMATIC_SCROLL_TRAVEL, CINEMATIC_SCROLL_DEFAULTS.travel, 0, 200),
    rotate: numberInRange(env.VITE_CINEMATIC_SCROLL_ROTATE, CINEMATIC_SCROLL_DEFAULTS.rotate, 0, 16),
    scale: numberInRange(env.VITE_CINEMATIC_SCROLL_SCALE, CINEMATIC_SCROLL_DEFAULTS.scale, 0, 0.25),
    blur: numberInRange(env.VITE_CINEMATIC_SCROLL_BLUR, CINEMATIC_SCROLL_DEFAULTS.blur, 0, 20),
    minOpacity: numberInRange(env.VITE_CINEMATIC_SCROLL_MIN_OPACITY, CINEMATIC_SCROLL_DEFAULTS.minOpacity, 0.1, 1),
  });
}

export const cinematicScrollConfig = resolveCinematicScrollConfig(import.meta.env ?? {});

const MENU_EFFECTS_DEFAULTS = Object.freeze({
  enabled: true,
  background: true,
  depth: true,
  scramble: true,
  entrance: true,
});

export function resolveMenuEffectsConfig(env = {}) {
  return Object.freeze({
    enabled: boolChoice(env.VITE_MENU_EFFECTS_ENABLED, MENU_EFFECTS_DEFAULTS.enabled),
    background: boolChoice(env.VITE_MENU_EFFECTS_BACKGROUND, MENU_EFFECTS_DEFAULTS.background),
    depth: boolChoice(env.VITE_MENU_EFFECTS_DEPTH, MENU_EFFECTS_DEFAULTS.depth),
    scramble: boolChoice(env.VITE_MENU_EFFECTS_SCRAMBLE, MENU_EFFECTS_DEFAULTS.scramble),
    entrance: boolChoice(env.VITE_MENU_EFFECTS_ENTRANCE, MENU_EFFECTS_DEFAULTS.entrance),
  });
}

export const menuEffectsConfig = resolveMenuEffectsConfig(import.meta.env ?? {});

export const BROWSER_TAB_STYLES = Object.freeze([
    "signature",
    "monogram",
    "terminal",
    "orbit",
    "circuit",
]);

const BROWSER_TAB_TITLES = Object.freeze({
    signature: "Jayant Singh | Backend Engineer",
    monogram: "Jayant Bhadauria | Software Engineer",
    terminal: "jayant@backend ~ portfolio",
    orbit: "Jayant Singh | Distributed Systems",
    circuit: "Jayant Singh | SDE · FinTech",
});

const BROWSER_TAB_DEFAULTS = Object.freeze({
    style: "circuit",
});

export function resolveBrowserTabConfig(env = {}) {
    const style = stringChoice(
        env.VITE_BROWSER_TAB_STYLE,
        BROWSER_TAB_STYLES,
        BROWSER_TAB_DEFAULTS.style
    );
    const customTitle = String(env.VITE_BROWSER_TAB_TITLE ?? "").trim();

    return Object.freeze({
        style,
        title: customTitle || BROWSER_TAB_TITLES[style],
    });
}

export const browserTabConfig = resolveBrowserTabConfig(import.meta.env ?? {});