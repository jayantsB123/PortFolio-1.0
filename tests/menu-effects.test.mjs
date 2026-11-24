import assert from "node:assert/strict";
import test from "node:test";
import { resolveMenuEffectsConfig } from "../src/v2/config/setenv.js";

test("menu enables the existing interaction effects by default", () => {
  assert.deepEqual(resolveMenuEffectsConfig(), {
    enabled: true,
    background: true,
    depth: true,
    scramble: true,
    entrance: true,
  });
});

test("menu effects can be disabled independently", () => {
  const settings = resolveMenuEffectsConfig({
    VITE_MENU_EFFECTS_ENABLED: "false",
    VITE_MENU_EFFECTS_BACKGROUND: "off",
    VITE_MENU_EFFECTS_DEPTH: "0",
    VITE_MENU_EFFECTS_SCRAMBLE: "no",
    VITE_MENU_EFFECTS_ENTRANCE: "true",
  });
  assert.deepEqual(settings, {
    enabled: false,
    background: false,
    depth: false,
    scramble: false,
    entrance: true,
  });
});
