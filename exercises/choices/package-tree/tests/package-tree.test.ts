import assert from "node:assert/strict";
import { test } from "node:test";

import { totalVolume, totalWeight } from "#exercise";
import type { Carton, Item } from "#exercise";

const inner: Carton = {
  kind: "carton",
  label: "inner",
  children: [{ kind: "item", sku: "B1", weightKg: 1, volumeM3: 0.05 }],
};

const shipment: Carton = {
  kind: "carton",
  label: "outer",
  children: [
    { kind: "item", sku: "A1", weightKg: 2, volumeM3: 0.1 },
    { kind: "item", sku: "A2", weightKg: 3, volumeM3: 0.2 },
    inner,
  ],
};

test("totalWeight sums every item's weight, however deeply nested", () => {
  assert.equal(totalWeight(shipment), 6);
});

test("totalVolume sums every item's volume, however deeply nested", () => {
  assert.ok(Math.abs(totalVolume(shipment) - 0.35) < 1e-9);
});

test("a lone item totals its own weight and volume", () => {
  const item: Item = { kind: "item", sku: "C1", weightKg: 4, volumeM3: 0.4 };
  assert.equal(totalWeight(item), 4);
  assert.equal(totalVolume(item), 0.4);
});

test("an empty carton totals zero", () => {
  const empty: Carton = { kind: "carton", label: "empty", children: [] };
  assert.equal(totalWeight(empty), 0);
  assert.equal(totalVolume(empty), 0);
});

test("totalWeight and totalVolume agree on the same tree's item count implicitly - both walk every node", () => {
  assert.equal(totalWeight(inner), 1);
  assert.equal(totalVolume(inner), 0.05);
});
