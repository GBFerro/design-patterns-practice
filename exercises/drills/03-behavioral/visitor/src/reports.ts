import type { LogRecord } from "./record.ts";

/** A human-readable line for the night's log. */
export function toLine(record: LogRecord): string {
  return record.toLine();
}

/** Telescope time this record cost, in seconds. */
export function costSeconds(record: LogRecord): number {
  return record.costSeconds();
}

/** Whether this record is worth flagging in a nightly review. */
export function isAnomaly(record: LogRecord): boolean {
  return record.isAnomaly();
}
