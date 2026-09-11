import { BaseRule } from "../rule.ts";
import type { ObservationRequest, Telescope } from "../types.ts";

export class InstrumentAvailableRule extends BaseRule {
  protected check(request: ObservationRequest, telescope: Telescope): string | null {
    if (!telescope.availableInstruments.includes(request.instrumentName)) {
      return `${request.instrumentName} is not available on ${telescope.name}`;
    }
    return null;
  }
}
