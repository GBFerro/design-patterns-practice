export type JobKind = "business-cards" | "brochure" | "banner";

/** What comes in from a customer, over the counter, as a reprint, or as one
 *  row of a batch import - the same shape every time. */
export interface OrderRequest {
  jobKind: JobKind;
  customerName: string;
  quantity: number;
  doubleSided?: boolean; // business-cards only
  foldType?: "tri" | "bi"; // brochure only
  widthCm?: number; // banner only
}

/** What every job becomes, regardless of which of the three counters took
 *  the order. */
export interface PrintJob {
  readonly jobKind: JobKind;
  readonly customerName: string;
  readonly quantity: number;
  describe(): string;
  estimatedMinutes(): number;
}
