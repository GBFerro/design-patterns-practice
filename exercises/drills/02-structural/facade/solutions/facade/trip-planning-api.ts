import { TripPlanner } from "./trip-planner.ts";
import type { TripPlan } from "./types.ts";

const tripPlanner = new TripPlanner();

/** Called by the HTTP handler behind `GET /trips/plan`. */
export function planTrip(originName: string, destinationName: string): TripPlan {
  return tripPlanner.plan(originName, destinationName);
}
