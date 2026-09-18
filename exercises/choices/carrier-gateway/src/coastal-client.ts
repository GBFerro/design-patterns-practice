import { recordCarrierCall } from "./call-tracker.ts";

const BASE_CENTS = 390;
const CENTS_PER_KG = 71;

/**
 * A pre-existing SDK function, from a third vendor - the oldest integration
 * Ravensgate has, and it shows: a single pipe-delimited string, `"cents|days"`.
 * Its shape is not ours to change.
 */
export function coastalEstimate(payload: string): string {
  recordCarrierCall("coastal");
  const [originZip = "0", destZip = "0", weightKg = "0"] = payload.split("|");
  const distanceFactor = Math.abs(Number(destZip) - Number(originZip)) % 41;
  const cents = BASE_CENTS + Math.round(Number(weightKg) * CENTS_PER_KG) + distanceFactor;
  const days = Number(weightKg) > 25 ? 6 : 3;
  return `${cents}|${days}`;
}
