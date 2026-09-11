import { buildChain } from "./chain.ts";
import type { ObservationRequest, Telescope } from "./types.ts";

export function validateRequest(request: ObservationRequest, telescope: Telescope): string | null {
  return buildChain(telescope).handle(request, telescope);
}
