/** Component: every fare, plain or modified, answers the same question. */
export interface Fare {
  priceCents(): number;
}

const BASE_FARE_CENTS = 275;

/** ConcreteComponent: the fare before any modifier has touched it. */
export class BaseFare implements Fare {
  priceCents(): number {
    return BASE_FARE_CENTS;
  }
}
