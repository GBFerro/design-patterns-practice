import assert from "node:assert/strict";
import { test } from "node:test";

import { currentPositions, printFleetPositions } from "#exercise";

test("returns the position for a single vehicle", () => {
  const [position] = currentPositions(["bus-14"]);
  assert.deepEqual(position, {
    vehicleId: "bus-14",
    latitude: 41.234,
    longitude: -111.456,
  });
});

test("returns positions for several vehicles, in order", () => {
  const positions = currentPositions(["bus-22", "bus-31"]);
  assert.deepEqual(
    positions.map((position) => position.vehicleId),
    ["bus-22", "bus-31"],
  );
});

test("returns the same vehicle's position twice if asked for it twice", () => {
  const positions = currentPositions(["bus-14", "bus-14"]);
  assert.deepEqual(positions[0], positions[1]);
});

test("rejects an unknown vehicle", () => {
  assert.throws(() => currentPositions(["ghost-1"]), /unknown vehicle/);
});

test("the CLI agrees with the dashboard for the same request", () => {
  const dashboardPositions = currentPositions(["bus-14", "bus-31"]);
  const cliPositions = printFleetPositions(["bus-14", "bus-31"]);
  assert.deepEqual(cliPositions, dashboardPositions);
});
