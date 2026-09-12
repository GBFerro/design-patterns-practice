import type { JobTemplate, TemplateName } from "./types.ts";

/** The print shop's own prototypes - one saved template per job a customer
 *  is likely to reorder. Every order starts as a clone of one of these,
 *  never the template itself. */
export const TEMPLATES: Record<TemplateName, JobTemplate> = {
  "rush-banner": {
    name: "Rush banner",
    jobKind: "banner",
    basePrice: 45,
    defaultQuantity: 1,
    finishingOptions: ["grommets", "waterproof-coating"],
  },
  "letterhead-standard": {
    name: "Standard letterhead",
    jobKind: "brochure",
    basePrice: 12,
    defaultQuantity: 250,
    finishingOptions: ["watermark"],
  },
};
