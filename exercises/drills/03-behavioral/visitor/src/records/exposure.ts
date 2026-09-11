import { LogRecord } from "../record.ts";

/** A completed exposure. The only record kind that costs telescope time;
 *  never flagged as an anomaly on its own. */
export class ExposureRecord extends LogRecord {
  constructor(
    readonly instrumentName: string,
    readonly seconds: number,
  ) {
    super();
  }

  toLine(): string {
    return `exposure ${this.seconds}s on ${this.instrumentName}`;
  }

  costSeconds(): number {
    return this.seconds;
  }

  isAnomaly(): boolean {
    return false;
  }
}
