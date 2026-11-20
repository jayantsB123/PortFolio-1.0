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
