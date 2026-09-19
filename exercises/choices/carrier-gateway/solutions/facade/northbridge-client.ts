import { recordCarrierCall } from "./call-tracker.ts";

export interface NorthbridgeQuote {
  readonly totalCents: number;
  readonly transitDays: number;
}

const BASE_CENTS = 480;
const CENTS_PER_KG = 62;

/** A pre-existing SDK function. Its shape is not ours to change. */
export function northbridgeQuote(
  originZip: string,
  destZip: string,
  weightKg: number,
): NorthbridgeQuote {
  recordCarrierCall("northbridge");
  const distanceFactor = Math.abs(Number(destZip) - Number(originZip)) % 37;
  return {
    totalCents: BASE_CENTS + Math.round(weightKg * CENTS_PER_KG) + distanceFactor,
    transitDays: weightKg > 20 ? 5 : 3,
  };
}
