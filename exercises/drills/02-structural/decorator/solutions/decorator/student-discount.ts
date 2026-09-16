import type { Fare } from "./fare.ts";

const STUDENT_DISCOUNT_FACTOR = 0.5;

/** Decorator: half whatever fare it wraps. */
export class StudentDiscount implements Fare {
  constructor(private readonly inner: Fare) {}

  priceCents(): number {
    return Math.round(this.inner.priceCents() * STUDENT_DISCOUNT_FACTOR);
  }
}
