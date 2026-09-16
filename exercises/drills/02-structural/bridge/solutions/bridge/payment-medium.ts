/** Implementor: turns a base fare into an actual charge. Every fare
 *  policy shares these, without knowing which one it got. */
export interface PaymentMedium {
  chargeFor(baseFareCents: number): number;
}

/** Cash machines only accept quarters - round up to the nearest 25 cents. */
export class CashPayment implements PaymentMedium {
  chargeFor(baseFareCents: number): number {
    return Math.ceil(baseFareCents / 25) * 25;
  }
}

/** Card processing carries a flat per-ride fee. */
export class CardPayment implements PaymentMedium {
  chargeFor(baseFareCents: number): number {
    return baseFareCents + 10;
  }
}
