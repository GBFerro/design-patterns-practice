import type { FareOptions } from "./types.ts";

const BASE_FARE_CENTS = 275;
const STUDENT_DISCOUNT_FACTOR = 0.5;
const OFF_PEAK_DISCOUNT_FACTOR = 0.8;
const GROUP_CAP_CENTS = 200;

/** Every modifier, threaded through one function as a boolean - in a
 *  fixed order that only exists because this is the order the `if`s
 *  happen to be written in. */
export function calculateFare(options: FareOptions): number {
  let price = BASE_FARE_CENTS;
  if (options.isStudent) price = Math.round(price * STUDENT_DISCOUNT_FACTOR);
  if (options.isOffPeak) price = Math.round(price * OFF_PEAK_DISCOUNT_FACTOR);
  if (options.isGroupCapped) price = Math.min(price, GROUP_CAP_CENTS);
  return price;
}
