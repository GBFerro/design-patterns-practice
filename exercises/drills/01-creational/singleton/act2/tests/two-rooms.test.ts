import assert from "node:assert/strict";
import { test } from "node:test";

import { createPressRoom } from "#exercise";

test("two press rooms compute their own rush quotes independently", () => {
  const mainFloor = createPressRoom({ rushSurchargePercent: 20, maxDailyRushJobs: 5, maintenanceMode: false });
  const nightShift = createPressRoom({ rushSurchargePercent: 0, maxDailyRushJobs: 12, maintenanceMode: false });

  assert.equal(mainFloor.rushQuoteTotal(100), 120);
  assert.equal(nightShift.rushQuoteTotal(100), 100);
});

test("two press rooms accept rush jobs against their own daily cap", () => {
  const mainFloor = createPressRoom({ rushSurchargePercent: 20, maxDailyRushJobs: 5, maintenanceMode: false });
  const nightShift = createPressRoom({ rushSurchargePercent: 0, maxDailyRushJobs: 12, maintenanceMode: false });

  assert.equal(mainFloor.canAcceptAnotherRushJob(8), false);
  assert.equal(nightShift.canAcceptAnotherRushJob(8), true);
});

test("putting one press room into maintenance does not affect the other", () => {
  const mainFloor = createPressRoom({ rushSurchargePercent: 20, maxDailyRushJobs: 5, maintenanceMode: false });
  const nightShift = createPressRoom({ rushSurchargePercent: 0, maxDailyRushJobs: 12, maintenanceMode: false });

  nightShift.setMaintenanceMode(true);

  assert.equal(mainFloor.canAcceptNewJob(), true);
  assert.equal(nightShift.canAcceptNewJob(), false);
});
