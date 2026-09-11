import { LogRecord } from "../record.ts";

/** A weather note. Costs no telescope time by itself; severe conditions
 *  are worth flagging. */
export class WeatherRecord extends LogRecord {
  constructor(
    readonly condition: string,
    readonly severity: number,
  ) {
    super();
  }

  toLine(): string {
    return `weather: ${this.condition} (severity ${this.severity})`;
  }

  costSeconds(): number {
    return 0;
  }

  isAnomaly(): boolean {
    return this.severity >= 8;
  }
}
