import type { DeliveryMethod, JobKind, Quote, QuoteDraft } from "./types.ts";

/** Everything a quote needs, held in one object so build() can spread it
 *  wholesale into the result - a new field is one more property here, not
 *  one more name to repeat in a hand-written return statement. */
interface QuoteState {
  customerName: string;
  jobKind: JobKind;
  quantity: number;
  baseUnitCost: number;
  quotedBy: string;
  rushFee: number;
  discountPercent: number;
  proofRequired: boolean;
  deliveryMethod: DeliveryMethod;
}

/** Fluent stages mutate one internal state object and hand back `this` - no
 *  stage validates anything, because no stage can yet see the final value of
 *  every field. Every business rule is checked exactly once, in build(),
 *  after the chain is done. */
class QuoteBuilder implements QuoteDraft {
  constructor(private readonly state: QuoteState) {}

  applyRush(rushFee: number): QuoteDraft {
    this.state.rushFee = rushFee;
    return this;
  }

  applyDiscount(discountPercent: number): QuoteDraft {
    this.state.discountPercent = discountPercent;
    return this;
  }

  setProofRequired(proofRequired: boolean): QuoteDraft {
    this.state.proofRequired = proofRequired;
    return this;
  }

  setDeliveryMethod(deliveryMethod: DeliveryMethod): QuoteDraft {
    this.state.deliveryMethod = deliveryMethod;
    return this;
  }

  build(): Quote {
    const { discountPercent, rushFee, deliveryMethod, quantity, baseUnitCost } = this.state;

    if (discountPercent > 0 && rushFee > 0) {
      throw new Error("a rush job cannot also receive a discount");
    }
    if (deliveryMethod === "courier" && quantity < 50) {
      throw new Error("courier delivery is not available for orders under 50 units");
    }

    const totalCost = baseUnitCost * quantity * (1 - discountPercent / 100) + rushFee;
    return { ...this.state, totalCost };
  }
}

/** Same frozen signature as `src/`'s version - opens a builder instead of a
 *  closure, with every optional field at its default, ready to chain. */
export function startQuote(
  customerName: string,
  jobKind: JobKind,
  quantity: number,
  baseUnitCost: number,
  quotedBy: string,
): QuoteDraft {
  return new QuoteBuilder({
    customerName,
    jobKind,
    quantity,
    baseUnitCost,
    quotedBy,
    rushFee: 0,
    discountPercent: 0,
    proofRequired: false,
    deliveryMethod: "pickup",
  });
}
