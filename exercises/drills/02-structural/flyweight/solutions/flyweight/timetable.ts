import { StopMetadataFactory } from "./stop-metadata-factory.ts";
import type { StopTime, TripStopEntry } from "./types.ts";

const stopMetadataFactory = new StopMetadataFactory();

/** One StopTime per trip-stop pair. Caldermoor's weekday timetable is 200,000 of these -
 *  and every one of them asks the factory for its stop, instead of building one. */
export function buildTimetable(entries: readonly TripStopEntry[]): StopTime[] {
  return entries.map((entry) => ({
    stop: stopMetadataFactory.get(entry.stopId),
    tripId: entry.tripId,
    arrivalMinutes: entry.arrivalMinutes,
    departureMinutes: entry.departureMinutes,
  }));
}
