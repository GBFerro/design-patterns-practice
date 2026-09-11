import type { ObservationLog } from "./log.ts";
import type { LogEntry } from "./types.ts";

/** Every message, oldest first. */
export function allMessages(log: ObservationLog): string[] {
  return [...log].map((entry) => entry.message);
}

/** The most recent `count` entries, oldest of that group first. */
export function lastEntries(log: ObservationLog, count: number): LogEntry[] {
  const all = [...log];
  return all.slice(Math.max(0, all.length - count));
}

/** The first entry whose message contains `needle`, or undefined if none does. */
export function findFirst(log: ObservationLog, needle: string): LogEntry | undefined {
  for (const entry of log) {
    if (entry.message.includes(needle)) return entry;
  }
  return undefined;
}
