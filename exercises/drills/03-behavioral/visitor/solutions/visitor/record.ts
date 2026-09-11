import type { LogRecordVisitor } from "./visitor.ts";

/** One entry in the night's log. Every concrete record only has to know how
 *  to hand itself to a visitor - not what any report computes from it. */
export abstract class LogRecord {
  abstract accept<R>(visitor: LogRecordVisitor<R>): R;
}
