import type { Route } from "./types.ts";

const MINUTES_PER_LEG = 4;

/** Subsystem 3: when the next vehicle for this route actually leaves. */
export class ScheduleLookup {
  nextDepartureMinutes(route: Route): number {
    return route.legs.length * MINUTES_PER_LEG;
  }
}
