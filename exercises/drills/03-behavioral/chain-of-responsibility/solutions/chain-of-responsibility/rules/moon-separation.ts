import { BaseRule } from "../rule.ts";
import type { ObservationRequest } from "../types.ts";

export class MoonSeparationRule extends BaseRule {
  protected check(request: ObservationRequest): string | null {
    if (request.moonSeparationDegrees < 15) return "target is too close to the moon";
    return null;
  }
}
