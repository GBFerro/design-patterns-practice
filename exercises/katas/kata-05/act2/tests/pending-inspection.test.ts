import assert from "node:assert/strict";
import { test } from "node:test";
import { applyChangeFeedEvent, syncInventorySnapshot } from "#exercise";
import type { LegacyWmsRecord } from "#exercise";

const pending: LegacyWmsRecord = {
  itemCode: "SKU-00231",
  qtyStr: "00042",
  statusCode: "P",
  binCode: "A-12-03",
  lastUpdatedRaw: "20250131235959",
};

const active: LegacyWmsRecord = {
  itemCode: "SKU-00998",
  qtyStr: "00007",
  statusCode: "A",
  binCode: "C-04-11",
  lastUpdatedRaw: "20250201000512",
};

test("applyChangeFeedEvent maps P to pendingInspection", () => {
  const result = applyChangeFeedEvent(pending);
  assert.equal(result.status, "pendingInspection");
});

test("applyChangeFeedEvent zeroes quantity for a pending-inspection record", () => {
  const result = applyChangeFeedEvent(pending);
  assert.equal(result.quantity, 0);
});

test("applyChangeFeedEvent leaves an active record's quantity untouched", () => {
  const result = applyChangeFeedEvent(active);
  assert.equal(result.quantity, 7);
  assert.equal(result.status, "active");
});

test("syncInventorySnapshot zeroes quantity for a pending-inspection record in a batch", () => {
  const [result] = syncInventorySnapshot([pending]);
  assert.equal(result?.status, "pendingInspection");
  assert.equal(result?.quantity, 0);
});

test("syncInventorySnapshot leaves other statuses in the same batch untouched", () => {
  const [, secondResult] = syncInventorySnapshot([pending, active]);
  assert.equal(secondResult?.status, "active");
  assert.equal(secondResult?.quantity, 7);
});

test("location and timestamp parsing are unaffected by the new status", () => {
  const result = applyChangeFeedEvent(pending);
  assert.deepEqual(result.location, { aisle: "A", shelf: "12", bin: "03" });
  assert.equal(result.lastUpdated, "2025-01-31T23:59:59Z");
});
