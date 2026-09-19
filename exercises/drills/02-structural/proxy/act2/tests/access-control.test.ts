import assert from "node:assert/strict";
import { test } from "node:test";

import {
  currentPositions,
  printFleetPositions,
  realLookupCount,
  resetRealLookupCount,
} from "#exercise";

test("an allowed vehicle still returns its position from the dashboard", () => {
  const [position] = currentPositions(["bus-14"]);
  assert.equal(position!.vehicleId, "bus-14");
});

test("an allowed vehicle still returns its position from the CLI", () => {
  const [position] = printFleetPositions(["bus-14"]);
  assert.equal(position!.vehicleId, "bus-14");
});

test("a restricted vehicle is refused from the dashboard", () => {
  assert.throws(() => currentPositions(["svc-9"]), /access denied for vehicle: svc-9/);
});

test("a restricted vehicle is refused from the CLI too", () => {
  assert.throws(() => printFleetPositions(["svc-9"]), /access denied for vehicle: svc-9/);
});

test("a restricted vehicle never reaches the real lookup, from either caller", () => {
  resetRealLookupCount();
  assert.throws(() => currentPositions(["svc-9"]));
  assert.throws(() => printFleetPositions(["svc-9"]));
  assert.equal(realLookupCount(), 0);
});

test("a restricted vehicle in a mixed batch blocks before any allowed vehicle is looked up", () => {
  resetRealLookupCount();
  assert.throws(() => currentPositions(["svc-9", "bus-14"]));
  assert.equal(realLookupCount(), 0);
});
