import { TripPlanner } from "./trip-planner.ts";
import type { TripPlan } from "./types.ts";

const tripPlanner = new TripPlanner();

/** Called by `dp-cli trip-summary <origin> <destination>`. */
export function printTripSummary(originName: string, destinationName: string): TripPlan {
  return tripPlanner.plan(originName, destinationName);
}
