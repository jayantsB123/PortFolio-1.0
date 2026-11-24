import assert from "node:assert/strict";
import test from "node:test";
import { resolveCinematicScrollConfig } from "../src/v2/config/setenv.js";

test("cinematic scroll uses the full-strength preview defaults", () => {
  assert.deepEqual(resolveCinematicScrollConfig(), {
    enabled: true,
    strength: 100,
    travel: 104,
    rotate: 8,
    scale: 0.12,
    blur: 9,
    minOpacity: 0.15,
  });
});

test("cinematic scroll can be turned off or tuned without invalid values", () => {
  const options = resolveCinematicScrollConfig({
    VITE_CINEMATIC_SCROLL_ENABLED: "false",
    VITE_CINEMATIC_SCROLL_STRENGTH: 160,
    VITE_CINEMATIC_SCROLL_TRAVEL: -20,
    VITE_CINEMATIC_SCROLL_ROTATE: 50,
    VITE_CINEMATIC_SCROLL_SCALE: 0.4,
    VITE_CINEMATIC_SCROLL_BLUR: -9,
    VITE_CINEMATIC_SCROLL_MIN_OPACITY: "broken",
  });
  assert.equal(options.enabled, false);
  assert.equal(options.strength, 100);
  assert.equal(options.travel, 0);
  assert.equal(options.rotate, 16);
  assert.equal(options.scale, 0.25);
  assert.equal(options.blur, 0);
  assert.equal(options.minOpacity, 0.15);
});
