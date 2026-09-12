export type JobKind = "business-cards" | "brochure" | "banner";
export type TemplateName = "rush-banner" | "letterhead-standard";

/** A saved starter for a print job - cloned fresh for every new order,
 *  never handed out or edited directly. */
export interface JobTemplate {
  name: string;
  jobKind: JobKind;
  basePrice: number;
  defaultQuantity: number;
  finishingOptions: string[];
}
