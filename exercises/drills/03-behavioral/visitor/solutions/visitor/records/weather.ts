import { LogRecord } from "../record.ts";
import type { LogRecordVisitor } from "../visitor.ts";

export class WeatherRecord extends LogRecord {
  constructor(
    readonly condition: string,
    readonly severity: number,
  ) {
    super();
  }

  accept<R>(visitor: LogRecordVisitor<R>): R {
    return visitor.visitWeather(this);
  }
}
