import type { DeliveryMethod, JobKind, Quote, QuoteDraft } from "./types.ts";

/** Everything a draft needs to know before it can price itself. */
interface DraftState {
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

/** Each stage returns a fresh draft closed over the next state, so nothing
 *  about call order is fixed - which means a rule spanning two fields has to
 *  be checked from *both* fields' stages, not just whichever one happens to
 *  come second. */
function draftFrom(state: DraftState): QuoteDraft {
  return {
    applyRush(rushFee: number): QuoteDraft {
      if (state.discountPercent > 0) {
        throw new Error("a rush job cannot also receive a discount");
      }
      return draftFrom({ ...state, rushFee });
    },

    applyDiscount(discountPercent: number): QuoteDraft {
      if (state.rushFee > 0) {
        throw new Error("a rush job cannot also receive a discount");
      }
      return draftFrom({ ...state, discountPercent });
    },

    setProofRequired(proofRequired: boolean): QuoteDraft {
      return draftFrom({ ...state, proofRequired });
    },

    setDeliveryMethod(deliveryMethod: DeliveryMethod): QuoteDraft {
      if (deliveryMethod === "courier" && state.quantity < 50) {
        throw new Error("courier delivery is not available for orders under 50 units");
      }
      return draftFrom({ ...state, deliveryMethod });
    },

    build(): Quote {
      const totalCost =
        state.baseUnitCost * state.quantity * (1 - state.discountPercent / 100) + state.rushFee;
      return { ...state, totalCost };
    },
  };
}

/** Opens a draft with every optional field at its default, ready to chain. */
export function startQuote(
  customerName: string,
  jobKind: JobKind,
  quantity: number,
  baseUnitCost: number,
  quotedBy: string,
): QuoteDraft {
  return draftFrom({
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
