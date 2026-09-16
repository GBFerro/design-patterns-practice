import assert from "node:assert/strict";
import { test } from "node:test";

import { planTrip, printTripSummary } from "#exercise";

test("the existing routes are unaffected by the Riverside expansion", () => {
  const harborSq = planTrip("mill-ave", "harbor-sq");
  assert.equal(harborSq.departureMinutesFromNow, 4);
  assert.equal(harborSq.fareCents, 325);

  const castleview = planTrip("mill-ave", "castleview");
  assert.equal(castleview.departureMinutesFromNow, 8);
  assert.equal(castleview.fareCents, 400);
});

test("a Green Line trip to Riverside carries the new surcharge", () => {
  const plan = planTrip("mill-ave", "riverside");
  assert.equal(plan.fareCents, 375);
});

test("a Green Line trip to Riverside accounts for the new timezone buffer", () => {
  const plan = planTrip("mill-ave", "riverside");
  assert.equal(plan.departureMinutesFromNow, 7);
});

test("the real-time feed reports the Green Line alert the old static table never knew about", () => {
  const plan = planTrip("mill-ave", "riverside");
  assert.deepEqual(plan.alerts, ["Green Line: reduced weekend service to Riverside"]);
});

test("the CLI summary picks up every act 2 change too", () => {
  const apiPlan = planTrip("mill-ave", "riverside");
  const cliPlan = printTripSummary("mill-ave", "riverside");
  assert.deepEqual(cliPlan, apiPlan);
});
