import { BaseRule } from "../rule.ts";
import type { ObservationRequest } from "../types.ts";

/** Only ever wired into a telescope's chain when that telescope has a
 *  movable dome (see chain.ts) - it never has to ask. */
export class DomeClearanceRule extends BaseRule {
  protected check(request: ObservationRequest): string | null {
    if (request.altitudeDegrees > 85)
      return "near-zenith pointing risks dome slit clearance";
    return null;
  }
}
