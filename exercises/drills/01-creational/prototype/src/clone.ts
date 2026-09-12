import { TEMPLATES } from "./templates.ts";
import type { JobTemplate, TemplateName } from "./types.ts";

/** Copies every field of a saved template by hand, one at a time - correct
 *  today, but only because someone already found and fixed the one field
 *  this style makes easy to get wrong (see tests/template.test.ts, the
 *  regression that guards `finishingOptions`). */
export function cloneTemplate(name: TemplateName): JobTemplate {
  const template = TEMPLATES[name];
  return {
    name: template.name,
    jobKind: template.jobKind,
    basePrice: template.basePrice,
    defaultQuantity: template.defaultQuantity,
    finishingOptions: [...template.finishingOptions],
  };
}
