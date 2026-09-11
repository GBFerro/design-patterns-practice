import type { ObservationRequest, Telescope } from "./types.ts";

export interface ValidationRule {
  setNext(rule: ValidationRule): ValidationRule;
  handle(request: ObservationRequest, telescope: Telescope): string | null;
}

/** Every concrete rule only has to write `check`. Linking and delegation to
 *  the next rule live here, once. */
export abstract class BaseRule implements ValidationRule {
  private next: ValidationRule | undefined;

  setNext(rule: ValidationRule): ValidationRule {
    this.next = rule;
    return rule;
  }

  handle(request: ObservationRequest, telescope: Telescope): string | null {
    const failure = this.check(request, telescope);
    if (failure !== null) return failure;
    return this.next?.handle(request, telescope) ?? null;
  }

  protected abstract check(request: ObservationRequest, telescope: Telescope): string | null;
}
