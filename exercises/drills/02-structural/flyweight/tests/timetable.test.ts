import assert from "node:assert/strict";
import { test } from "node:test";

import { buildTimetable, renderStopTime } from "#exercise";

test("renders a stop time with its zone and accessibility", () => {
  const [stopTime] = buildTimetable([
    { tripId: "101", stopId: "mill-ave", arrivalMinutes: 432, departureMinutes: 433 },
  ]);
  assert.equal(renderStopTime(stopTime!), "07:12 · Mill Ave (Zone A) ♿");
});

test("renders a stop time for a stop with no wheelchair access", () => {
  const [stopTime] = buildTimetable([
    { tripId: "101", stopId: "harbor-sq", arrivalMinutes: 60, departureMinutes: 61 },
  ]);
  assert.equal(renderStopTime(stopTime!), "01:00 · Harbor Square (Zone A)");
});

test("builds a timetable with one entry per trip-stop pair", () => {
  const timetable = buildTimetable([
    { tripId: "101", stopId: "mill-ave", arrivalMinutes: 432, departureMinutes: 433 },
    { tripId: "101", stopId: "harbor-sq", arrivalMinutes: 444, departureMinutes: 445 },
    { tripId: "102", stopId: "mill-ave", arrivalMinutes: 492, departureMinutes: 493 },
  ]);
  assert.equal(timetable.length, 3);
  assert.deepEqual(
    timetable.map((entry) => entry.tripId),
    ["101", "101", "102"],
  );
});

test("rejects an unknown stop", () => {
  assert.throws(
    () => buildTimetable([{ tripId: "999", stopId: "nowhere", arrivalMinutes: 0, departureMinutes: 1 }]),
    /unknown stop/,
  );
});
