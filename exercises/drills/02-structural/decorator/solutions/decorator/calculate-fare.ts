import { BaseFare, type Fare } from "./fare.ts";
import { GroupCap } from "./group-cap.ts";
import { OffPeakDiscount } from "./off-peak-discount.ts";
import { StudentDiscount } from "./student-discount.ts";
import type { FareOptions } from "./types.ts";

/** The only place that decides which modifiers apply, and in what order
 *  they wrap - each modifier's own math lives in its own class. */
export function calculateFare(options: FareOptions): number {
  let fare: Fare = new BaseFare();
  if (options.isStudent) fare = new StudentDiscount(fare);
  if (options.isOffPeak) fare = new OffPeakDiscount(fare);
  if (options.isGroupCapped) fare = new GroupCap(fare);
  return fare.priceCents();
}
