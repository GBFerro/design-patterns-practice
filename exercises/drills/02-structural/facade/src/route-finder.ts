import type { Route, RouteLeg, Stop } from "./types.ts";

const LEGS: Record<string, readonly RouteLeg[]> = {
  "mill-ave->harbor-sq": [{ lineId: "red", fromStopId: "mill-ave", toStopId: "harbor-sq", minutes: 12 }],
  "harbor-sq->mill-ave": [{ lineId: "red", fromStopId: "harbor-sq", toStopId: "mill-ave", minutes: 12 }],
  "mill-ave->castleview": [
    { lineId: "red", fromStopId: "mill-ave", toStopId: "harbor-sq", minutes: 12 },
    { lineId: "blue", fromStopId: "harbor-sq", toStopId: "castleview", minutes: 9 },
  ],
};

/** Subsystem 2: the legs a rider has to ride to get from one stop to another. */
export class RouteFinder {
  find(origin: Stop, destination: Stop): Route {
    const legs = LEGS[`${origin.id}->${destination.id}`];
    if (!legs) throw new Error(`no route from ${origin.name} to ${destination.name}`);
    return { origin, destination, legs };
  }
}
