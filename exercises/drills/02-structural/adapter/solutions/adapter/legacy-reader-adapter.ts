import type { FareRead, FareReader, LegacyCardScanner } from "./types.ts";

/** Makes a legacy scanner usable anywhere a FareReader is expected -
 *  dollars become cents, a card number becomes a cardId, and "no-card"
 *  becomes null instead of a status string a caller has to check. */
export class LegacyReaderAdapter implements FareReader {
  constructor(private readonly scanner: LegacyCardScanner) {}

  readFare(): FareRead | null {
    const result = this.scanner.scanCard();
    if (
      result.status === "no-card" ||
      result.cardNumber === undefined ||
      result.balanceDollars === undefined
    ) {
      return null;
    }
    return {
      cardId: result.cardNumber,
      balanceCents: Math.round(result.balanceDollars * 100),
    };
  }
}
