import type { LogRecord } from "./record.ts";
import { AnomalyVisitor } from "./reports/anomaly.ts";
import { CostVisitor } from "./reports/cost.ts";
import { ToLineVisitor } from "./reports/to-line.ts";

/** A human-readable line for the night's log. */
export function toLine(record: LogRecord): string {
  return record.accept(new ToLineVisitor());
}

/** Telescope time this record cost, in seconds. */
export function costSeconds(record: LogRecord): number {
  return record.accept(new CostVisitor());
}

/** Whether this record is worth flagging in a nightly review. */
export function isAnomaly(record: LogRecord): boolean {
  return record.accept(new AnomalyVisitor());
}
