import { LogRecord } from "../record.ts";
import type { LogRecordVisitor } from "../visitor.ts";

export class SeeingRecord extends LogRecord {
  constructor(readonly fwhmArcsec: number) {
    super();
  }

  accept<R>(visitor: LogRecordVisitor<R>): R {
    return visitor.visitSeeing(this);
  }
}
