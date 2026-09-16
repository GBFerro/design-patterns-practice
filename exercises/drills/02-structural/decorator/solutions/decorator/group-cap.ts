import type { Fare } from "./fare.ts";

const GROUP_CAP_CENTS = 200;

/** Decorator: never charges more than the group cap, whatever it wraps. */
export class GroupCap implements Fare {
  constructor(private readonly inner: Fare) {}

  priceCents(): number {
    return Math.min(this.inner.priceCents(), GROUP_CAP_CENTS);
  }
}
