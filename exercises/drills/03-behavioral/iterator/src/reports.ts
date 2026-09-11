import type { ObservationLog } from "./log.ts";
import type { LogEntry } from "./types.ts";

/** Every message, oldest first. */
export function allMessages(log: ObservationLog): string[] {
  const messages: string[] = [];
  for (let page = 0; page < log.pageCount; page++) {
    for (let offset = 0; offset < log.entriesInPage(page); offset++) {
      messages.push(log.entryAt(page, offset).message);
    }
  }
  return messages;
}

/** The most recent `count` entries, oldest of that group first. */
export function lastEntries(log: ObservationLog, count: number): LogEntry[] {
  const flat: LogEntry[] = [];
  for (let page = 0; page < log.pageCount; page++) {
    for (let offset = 0; offset < log.entriesInPage(page); offset++) {
      flat.push(log.entryAt(page, offset));
    }
  }
  return flat.slice(Math.max(0, flat.length - count));
}

/** The first entry whose message contains `needle`, or undefined if none does. */
export function findFirst(log: ObservationLog, needle: string): LogEntry | undefined {
  for (let page = 0; page < log.pageCount; page++) {
    for (let offset = 0; offset < log.entriesInPage(page); offset++) {
      const entry = log.entryAt(page, offset);
      if (entry.message.includes(needle)) return entry;
    }
  }
  return undefined;
}
