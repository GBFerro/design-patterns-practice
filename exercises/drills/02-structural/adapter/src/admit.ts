import type { AdmissionResult, FareReader, LegacyCardScanner } from "./types.ts";

const FARE_CENTS = 275;

/** The turnstile's admission rule, for any reader that already speaks
 *  FareReader - every modern station. */
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

/** The same admission rule, written a second time, for the three stations
 *  still running legacy scanners - dollars converted to cents right here,
 *  because nothing else in this file knows how to. */
export function admitLegacyPassenger(scanner: LegacyCardScanner): AdmissionResult {
  const result = scanner.scanCard();
  if (result.status === "no-card" || result.balanceDollars === undefined) {
    return { admitted: false, reason: "no card presented" };
  }
  const balanceCents = Math.round(result.balanceDollars * 100);
  if (balanceCents < FARE_CENTS) {
    return { admitted: false, reason: "insufficient balance" };
  }
  return { admitted: true, remainingBalanceCents: balanceCents - FARE_CENTS };
}
