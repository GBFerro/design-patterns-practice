import { LegacyReaderAdapter } from "./legacy-reader-adapter.ts";
import type { AdmissionResult, FareReader, LegacyCardScanner } from "./types.ts";

const FARE_CENTS = 275;

/** The turnstile's one admission rule, for anything that speaks
 *  FareReader - modern stations directly, legacy ones through an
 *  adapter. */
export function admitPassenger(reader: FareReader): AdmissionResult {
  const read = reader.readFare();
  if (read === null) {
    return { admitted: false, reason: "no card presented" };
  }
  if (read.balanceCents < FARE_CENTS) {
    return { admitted: false, reason: "insufficient balance" };
  }
  return { admitted: true, remainingBalanceCents: read.balanceCents - FARE_CENTS };
}

export function admitLegacyPassenger(scanner: LegacyCardScanner): AdmissionResult {
  return admitPassenger(new LegacyReaderAdapter(scanner));
}
