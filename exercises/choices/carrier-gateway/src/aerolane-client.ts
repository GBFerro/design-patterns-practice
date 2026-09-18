import { recordCarrierCall } from "./call-tracker.ts";

export interface AerolaneRequest {
  readonly from: string;
  readonly to: string;
  readonly kg: number;
}

export interface AerolaneRate {
  readonly priceCents: number;
  readonly days: number;
}

const BASE_CENTS = 610;
const CENTS_PER_KG = 54;

/** A pre-existing SDK function, from a different vendor. Its shape is not ours to change. */
export function aerolaneRate(request: AerolaneRequest): AerolaneRate {
  recordCarrierCall("aerolane");
  const distanceFactor = Math.abs(Number(request.to) - Number(request.from)) % 29;
  return {
    priceCents: BASE_CENTS + Math.round(request.kg * CENTS_PER_KG) + distanceFactor,
    days: request.kg > 15 ? 4 : 2,
  };
}
