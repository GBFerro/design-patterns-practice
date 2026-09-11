import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluateConstraint, type SkyContext } from "#exercise";

const baseContext: SkyContext = {
  altitudeDegrees: 30,
  moonPhase: 0.2,
  seeingArcsec: 1.8,
  civilTwilightOver: true,
  domeOpen: true,
  clear: true,
  moonBelowHorizon: false,
};

test(">= passes when the value is exactly at the threshold", () => {
  assert.equal(evaluateConstraint("altitude >= 30", baseContext), true);
});

test(">= passes when the value is above the threshold, like >", () => {
  assert.equal(evaluateConstraint("altitude >= 30", { ...baseContext, altitudeDegrees: 45 }), true);
});

test(">= fails when the value is below the threshold", () => {
  assert.equal(evaluateConstraint("altitude >= 30", { ...baseContext, altitudeDegrees: 29 }), false);
});

test("moon_below_horizon reads the matching flag off the context", () => {
  assert.equal(evaluateConstraint("moon_below_horizon", { ...baseContext, moonBelowHorizon: true }), true);
  assert.equal(evaluateConstraint("moon_below_horizon", { ...baseContext, moonBelowHorizon: false }), false);
});

test("the new operator and the new term combine with && and with existing clauses", () => {
  const expression = "moon_below_horizon && altitude >= 30 && clear";
  assert.equal(evaluateConstraint(expression, { ...baseContext, moonBelowHorizon: true }), true);
  assert.equal(evaluateConstraint(expression, { ...baseContext, moonBelowHorizon: false }), false);
});
