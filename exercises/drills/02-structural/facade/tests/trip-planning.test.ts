import assert from "node:assert/strict";
import { test } from "node:test";

import { planTrip, printTripSummary } from "#exercise";

test("plans a direct one-leg trip", () => {
  const plan = planTrip("mill-ave", "harbor-sq");
  assert.equal(plan.route.legs.length, 1);
  assert.equal(plan.departureMinutesFromNow, 4);
  assert.equal(plan.fareCents, 325);
  assert.deepEqual(plan.alerts, ["Red Line: minor delays near Mill Ave"]);
});

test("plans a two-leg trip with a transfer", () => {
  const plan = planTrip("mill-ave", "castleview");
  assert.equal(plan.route.legs.length, 2);
  assert.equal(plan.departureMinutesFromNow, 8);
  assert.equal(plan.fareCents, 400);
  assert.deepEqual(plan.alerts, ["Red Line: minor delays near Mill Ave"]);
});

test("rejects an unknown stop", () => {
  assert.throws(() => planTrip("mill-ave", "nowhere"), /unknown stop/);
});

test("rejects a pair with no route between them", () => {
  assert.throws(() => planTrip("harbor-sq", "castleview"), /no route/);
});

test("the CLI summary agrees with the API for the same trip", () => {
  const apiPlan = planTrip("mill-ave", "harbor-sq");
  const cliPlan = printTripSummary("mill-ave", "harbor-sq");
  assert.deepEqual(cliPlan, apiPlan);
});
