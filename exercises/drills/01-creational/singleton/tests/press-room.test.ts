import assert from "node:assert/strict";
import { test } from "node:test";

import {
  canAcceptAnotherRushJob,
  canAcceptNewJob,
  describePressRoom,
  rushQuoteTotal,
  setMaintenanceMode,
} from "#exercise";

test("a rush job's total includes the configured rush surcharge", () => {
  assert.equal(rushQuoteTotal(100), 120);
});

test("another rush job is accepted below the daily cap", () => {
  assert.equal(canAcceptAnotherRushJob(3), true);
});

test("another rush job is refused at the daily cap", () => {
  assert.equal(canAcceptAnotherRushJob(5), false);
});

test("the press room describes its own configuration", () => {
  assert.equal(describePressRoom(), "rush surcharge 20%, up to 5 rush jobs/day");
});

test("a new job is accepted outside of maintenance", () => {
  assert.equal(canAcceptNewJob(), true);
});

// This test has to run last. The press room's settings are one shared,
// lazily-built instance - nothing exported from this module can hand back a
// fresh one, so nothing written after this point can undo what it does here.
// Reordering the file, or adding a new test above this one that happens to
// also assume maintenanceMode is still false, is a real, live trap.
test("no new job is accepted once maintenance mode is on - and nothing after this test can undo that", () => {
  setMaintenanceMode(true);
  assert.equal(canAcceptNewJob(), false);
});
