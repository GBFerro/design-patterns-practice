import type { Route } from "./types.ts";

const BASE_FARE_CENTS = 250;
const PER_LEG_CENTS = 75;

/** Subsystem 4: what this route costs, in cents. */
export class FareCalculator {
  calculate(route: Route): number {
    return BASE_FARE_CENTS + route.legs.length * PER_LEG_CENTS;
  }
}
