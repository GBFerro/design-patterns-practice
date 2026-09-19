import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { binLocation, binsInAisle, registerBin, resetRegistry } from "#exercise";
import type { BinLocation } from "#exercise";

const binA1: BinLocation = { binId: "A1", aisle: "A", shelf: 1, capacityUnits: 20 };
const binA2: BinLocation = { binId: "A2", aisle: "A", shelf: 2, capacityUnits: 15 };
const binB1: BinLocation = { binId: "B1", aisle: "B", shelf: 1, capacityUnits: 30 };

beforeEach(() => {
  resetRegistry();
});

test("a registered bin can be looked up by id", () => {
  registerBin(binA1);
  assert.deepEqual(binLocation("A1"), binA1);
});

test("looking up an unregistered bin returns undefined", () => {
  assert.equal(binLocation("does-not-exist"), undefined);
});

test("binsInAisle returns every bin registered in that aisle", () => {
  registerBin(binA1);
  registerBin(binA2);
  registerBin(binB1);
  const aisleA = binsInAisle("A");
  assert.equal(aisleA.length, 2);
  assert.ok(aisleA.some((bin) => bin.binId === "A1"));
  assert.ok(aisleA.some((bin) => bin.binId === "A2"));
});

test("binsInAisle returns nothing for an aisle with no bins", () => {
  registerBin(binA1);
  assert.deepEqual(binsInAisle("Z"), []);
});

test("resetRegistry clears every previously registered bin", () => {
  registerBin(binA1);
  resetRegistry();
  assert.equal(binLocation("A1"), undefined);
  assert.deepEqual(binsInAisle("A"), []);
});

test("registering a bin does not affect lookups for a different bin", () => {
  registerBin(binA1);
  registerBin(binB1);
  assert.deepEqual(binLocation("B1"), binB1);
  assert.equal(binsInAisle("B").length, 1);
});
