import { LogRecord } from "../record.ts";

/** A seeing measurement. Costs no telescope time by itself; a bad enough
 *  reading is worth flagging. */
export class SeeingRecord extends LogRecord {
  constructor(readonly fwhmArcsec: number) {
    super();
  }

  toLine(): string {
    return `seeing ${this.fwhmArcsec.toFixed(1)}"`;
  }

  costSeconds(): number {
    return 0;
  }

  isAnomaly(): boolean {
    return this.fwhmArcsec > 3.0;
  }
}
