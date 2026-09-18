import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { currentMode, planNextPick, recordPicked, resetPickingPolicy } from "#exercise";
import type { Order } from "#exercise";

beforeEach(() => {
  resetPickingPolicy();
});

function order(id: string, binId: string, queuedAt: number): Order {
  return { id, binId, queuedAt };
}

test("starts in individual mode", () => {
  assert.equal(currentMode(), "individual");
});

test("below the batch threshold, plans one order at a time, oldest first", () => {
  const queue = [order("o2", "bin-b", 2), order("o1", "bin-a", 1)];
  const instruction = planNextPick(queue);
  assert.deepEqual(instruction, { mode: "individual", binId: "bin-a", orderIds: ["o1"] });
  assert.equal(currentMode(), "individual");
});

test("throws when the queue is empty", () => {
  assert.throws(() => planNextPick([]), /no orders queued/);
});

test("reaching the threshold switches to batch mode and groups by the oldest order's bin", () => {
  const queue = [
    order("o1", "bin-a", 1),
    order("o2", "bin-a", 2),
    order("o3", "bin-b", 3),
  ];
  const instruction = planNextPick(queue);
  assert.equal(instruction.mode, "batch");
  assert.equal(currentMode(), "batch");
  assert.equal(instruction.binId, "bin-a");
  assert.deepEqual([...instruction.orderIds].sort(), ["o1", "o2"]);
});

test("an order that arrives after the batch started is not part of it", () => {
  const original = [order("o1", "bin-a", 1), order("o2", "bin-a", 2), order("o3", "bin-b", 3)];
  planNextPick(original); // enters batch mode, snapshots o1/o2/o3

  const withLateArrival = [...original, order("o4", "bin-a", 4)];
  const instruction = planNextPick(withLateArrival);
  assert.equal(instruction.mode, "batch");
  assert.ok(!instruction.orderIds.includes("o4"), "o4 queued after the batch started");
});

test("stays in batch mode even if the queue drops below the threshold mid-batch", () => {
  const queue = [order("o1", "bin-a", 1), order("o2", "bin-a", 2), order("o3", "bin-b", 3)];
  planNextPick(queue); // enters batch mode

  recordPicked("o1");
  recordPicked("o2");
  // only o3 is left of the original batch - below BATCH_THRESHOLD, but the batch isn't done
  const instruction = planNextPick([order("o3", "bin-b", 3)]);
  assert.equal(instruction.mode, "batch");
  assert.equal(currentMode(), "batch");
  assert.deepEqual(instruction.orderIds, ["o3"]);
});

test("returns to individual mode once every order in the batch is picked", () => {
  const queue = [order("o1", "bin-a", 1), order("o2", "bin-a", 2), order("o3", "bin-b", 3)];
  planNextPick(queue);
  recordPicked("o1");
  recordPicked("o2");
  recordPicked("o3");
  assert.equal(currentMode(), "individual");

  const instruction = planNextPick([order("o4", "bin-c", 4)]);
  assert.deepEqual(instruction, { mode: "individual", binId: "bin-c", orderIds: ["o4"] });
});

test("a fresh batch after returning to individual mode is its own snapshot", () => {
  const first = [order("o1", "bin-a", 1), order("o2", "bin-a", 2), order("o3", "bin-b", 3)];
  planNextPick(first);
  recordPicked("o1");
  recordPicked("o2");
  recordPicked("o3");
  assert.equal(currentMode(), "individual");

  const second = [order("o4", "bin-a", 4), order("o5", "bin-a", 5), order("o6", "bin-b", 6)];
  const instruction = planNextPick(second);
  assert.equal(instruction.mode, "batch");
  assert.deepEqual([...instruction.orderIds].sort(), ["o4", "o5"]);
});
