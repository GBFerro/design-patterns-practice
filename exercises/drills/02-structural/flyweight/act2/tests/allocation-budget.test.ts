import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildTimetable,
  renderStopTime,
  resetStopMetadataAllocations,
  stopMetadataAllocationCount,
} from "#exercise";

const STOP_IDS = ["mill-ave", "harbor-sq", "castleview"] as const;
const STOP_TIME_COUNT = 200_000;

test("200,000 stop-times allocate no more StopMetadata than there are distinct stops", () => {
  resetStopMetadataAllocations();

  const entries = Array.from({ length: STOP_TIME_COUNT }, (_, i) => ({
    tripId: `trip-${i}`,
    stopId: STOP_IDS[i % STOP_IDS.length]!,
    arrivalMinutes: i % 1440,
    departureMinutes: (i % 1440) + 1,
  }));

  const timetable = buildTimetable(entries);

  assert.equal(timetable.length, STOP_TIME_COUNT);
  assert.equal(stopMetadataAllocationCount(), STOP_IDS.length);
});

test("every stop-time still renders correctly at that scale", () => {
  resetStopMetadataAllocations();

  const timetable = buildTimetable([
    {
      tripId: "199999",
      stopId: "castleview",
      arrivalMinutes: 500,
      departureMinutes: 501,
    },
  ]);

  assert.equal(renderStopTime(timetable[0]!), "08:20 · Castleview (Zone B) ♿");
});
