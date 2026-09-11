import { BaseRule } from "../rule.ts";
import type { ObservationRequest, Telescope } from "../types.ts";

export class ExposureBudgetRule extends BaseRule {
  protected check(request: ObservationRequest, telescope: Telescope): string | null {
    if (request.exposureSeconds > telescope.nightlyExposureBudgetSeconds) {
      return "exposure exceeds the nightly budget";
    }
    return null;
  }
}
