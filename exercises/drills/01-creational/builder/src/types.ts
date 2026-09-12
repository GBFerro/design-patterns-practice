export type JobKind = "business-cards" | "brochure" | "banner";
export type DeliveryMethod = "pickup" | "courier";

/** A quote under construction. Every optional stage returns the next draft
 *  to keep chaining from, so nothing about the chain's length or order is
 *  fixed in advance. */
export interface QuoteDraft {
  applyRush(rushFee: number): QuoteDraft;
  applyDiscount(discountPercent: number): QuoteDraft;
  setProofRequired(proofRequired: boolean): QuoteDraft;
  setDeliveryMethod(deliveryMethod: DeliveryMethod): QuoteDraft;
  build(): Quote;
}

/** A fully-priced quote, every optional field defaulted and every business
 *  rule already checked. */
export interface Quote {
  customerName: string;
  jobKind: JobKind;
  quantity: number;
  baseUnitCost: number;
  quotedBy: string;
  rushFee: number;
  discountPercent: number;
  proofRequired: boolean;
  deliveryMethod: DeliveryMethod;
  totalCost: number;
}
