import { LogRecord } from "../record.ts";
import type { LogRecordVisitor } from "../visitor.ts";

export class ExposureRecord extends LogRecord {
  constructor(
    readonly instrumentName: string,
    readonly seconds: number,
  ) {
    super();
  }

  accept<R>(visitor: LogRecordVisitor<R>): R {
    return visitor.visitExposure(this);
  }
}
