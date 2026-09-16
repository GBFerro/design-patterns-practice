import { recordStopMetadataAllocation } from "./allocation-tracker.ts";
import { STOP_DIRECTORY } from "./stop-directory.ts";
import type { StopMetadata, StopTime, TripStopEntry } from "./types.ts";

function buildStopMetadata(stopId: string): StopMetadata {
  const entry = STOP_DIRECTORY[stopId];
  if (!entry) throw new Error(`unknown stop: ${stopId}`);
  recordStopMetadataAllocation();
  return { stopId, name: entry.name, zone: entry.zone, wheelchairAccessible: entry.wheelchairAccessible };
}

/** One StopTime per trip-stop pair. Caldermoor's weekday timetable is 200,000 of these -
 *  and every one of them builds its own fresh copy of whichever stop it stops at. */
export function buildTimetable(entries: readonly TripStopEntry[]): StopTime[] {
  return entries.map((entry) => ({
    stop: buildStopMetadata(entry.stopId),
    tripId: entry.tripId,
    arrivalMinutes: entry.arrivalMinutes,
    departureMinutes: entry.departureMinutes,
  }));
}
