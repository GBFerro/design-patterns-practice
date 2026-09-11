import { BaseRule } from "../rule.ts";
import type { ObservationRequest } from "../types.ts";

export class WeatherRule extends BaseRule {
  protected check(request: ObservationRequest): string | null {
    if (request.cloudCoverPercent > 50) return "cloud cover is too high";
    return null;
  }
}
