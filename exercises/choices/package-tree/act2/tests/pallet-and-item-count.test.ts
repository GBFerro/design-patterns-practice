import assert from "node:assert/strict";
import { test } from "node:test";

import { totalItemCount, totalVolume, totalWeight } from "#exercise";
import type { Carton, Pallet } from "#exercise";

const pallet: Pallet = {
  kind: "pallet",
  label: "P1",
  tareWeightKg: 5,
  children: [
    { kind: "item", sku: "B1", weightKg: 1, volumeM3: 0.05 },
    { kind: "item", sku: "B2", weightKg: 4, volumeM3: 0.4 },
  ],
};

const shipment: Carton = {
  kind: "carton",
  label: "outer",
  children: [
    { kind: "item", sku: "A1", weightKg: 2, volumeM3: 0.1 },
    { kind: "item", sku: "A2", weightKg: 3, volumeM3: 0.2 },
    pallet,
  ],
};

test("a pallet's weight is its own tare plus its children's total weight", () => {
  assert.equal(totalWeight(pallet), 5 + 1 + 4);
});

test("a pallet's volume is only its children's total volume - the pallet adds none of its own", () => {
  assert.ok(Math.abs(totalVolume(pallet) - (0.05 + 0.4)) < 1e-9);
});

test("a tree with a pallet totals weight correctly at every depth", () => {
  assert.equal(totalWeight(shipment), 2 + 3 + 5 + 1 + 4);
});

test("a tree with a pallet totals volume correctly - the tare never leaks into volume", () => {
  assert.ok(Math.abs(totalVolume(shipment) - (0.1 + 0.2 + 0.05 + 0.4)) < 1e-9);
});

test("totalItemCount counts every item leaf, through cartons and pallets alike", () => {
  assert.equal(totalItemCount(shipment), 4);
});

test("totalItemCount on a lone item is 1, and on an empty carton is 0", () => {
  assert.equal(
    totalItemCount({ kind: "item", sku: "C1", weightKg: 1, volumeM3: 0.01 }),
    1,
  );
  assert.equal(totalItemCount({ kind: "carton", label: "empty", children: [] }), 0);
});

test("a tree with no pallet still totals exactly as act 1 left it", () => {
  const noPallet: Carton = {
    kind: "carton",
    label: "outer",
    children: [
      { kind: "item", sku: "A1", weightKg: 2, volumeM3: 0.1 },
      { kind: "item", sku: "A2", weightKg: 3, volumeM3: 0.2 },
    ],
  };
  assert.equal(totalWeight(noPallet), 5);
  assert.ok(Math.abs(totalVolume(noPallet) - 0.3) < 1e-9);
  assert.equal(totalItemCount(noPallet), 2);
});
