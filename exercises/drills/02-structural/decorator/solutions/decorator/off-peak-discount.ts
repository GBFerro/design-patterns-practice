import type { Fare } from "./fare.ts";

const OFF_PEAK_DISCOUNT_FACTOR = 0.8;

/** Decorator: 80% of whatever fare it wraps. */
export class OffPeakDiscount implements Fare {
  constructor(private readonly inner: Fare) {}

  priceCents(): number {
    return Math.round(this.inner.priceCents() * OFF_PEAK_DISCOUNT_FACTOR);
  }
}
