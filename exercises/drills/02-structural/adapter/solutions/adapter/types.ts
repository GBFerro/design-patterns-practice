/** What a turnstile needs from any fare card it reads. */
export interface FareRead {
  cardId: string;
  balanceCents: number;
}

/** What every modern reader already speaks. */
export interface FareReader {
  readFare(): FareRead | null;
}

export interface AdmissionResult {
  admitted: boolean;
  reason?: string;
  remainingBalanceCents?: number;
}

/** What the fleet of legacy scanners still installed at three stations
 *  speak instead - dollars, not cents, and a status string rather than
 *  `null` for "no card". */
export interface LegacyScanResult {
  status: "no-card" | "ok";
  cardNumber?: string;
  balanceDollars?: number;
}

export interface LegacyCardScanner {
  scanCard(): LegacyScanResult;
}
