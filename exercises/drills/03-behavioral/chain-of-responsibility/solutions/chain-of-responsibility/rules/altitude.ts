import { BaseRule } from "../rule.ts";
import type { ObservationRequest } from "../types.ts";

export class AltitudeRule extends BaseRule {
  protected check(request: ObservationRequest): string | null {
    if (request.altitudeDegrees < 20) return "target is below the minimum altitude";
    return null;
  }
}
