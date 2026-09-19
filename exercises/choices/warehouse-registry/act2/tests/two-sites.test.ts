import assert from "node:assert/strict";
import { test } from "node:test";

import { createWarehouseRegistry } from "#exercise";
import type { BinLocation } from "#exercise";

const siteABin: BinLocation = { binId: "A1", aisle: "A", shelf: 1, capacityUnits: 20 };
const siteBBin: BinLocation = { binId: "B1", aisle: "A", shelf: 1, capacityUnits: 20 };

test("two registries look up their own bins independently", () => {
  const siteA = createWarehouseRegistry();
  const siteB = createWarehouseRegistry();

  siteA.registerBin(siteABin);
  siteB.registerBin(siteBBin);

  assert.deepEqual(siteA.binLocation("A1"), siteABin);
  assert.equal(siteB.binLocation("A1"), undefined);
  assert.deepEqual(siteB.binLocation("B1"), siteBBin);
  assert.equal(siteA.binLocation("B1"), undefined);
});

test("two registries report their own bins per aisle independently", () => {
  const siteA = createWarehouseRegistry();
  const siteB = createWarehouseRegistry();

  siteA.registerBin(siteABin);

  assert.equal(siteA.binsInAisle("A").length, 1);
  assert.equal(siteB.binsInAisle("A").length, 0);
});

test("clearing one registry does not affect the other", () => {
  const siteA = createWarehouseRegistry();
  const siteB = createWarehouseRegistry();

  siteA.registerBin(siteABin);
  siteB.registerBin(siteBBin);

  siteA.clear();

  assert.equal(siteA.binLocation("A1"), undefined);
  assert.deepEqual(siteB.binLocation("B1"), siteBBin);
});
