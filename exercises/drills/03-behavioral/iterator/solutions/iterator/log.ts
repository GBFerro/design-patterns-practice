import type { LogEntry } from "./types.ts";

const PAGE_SIZE = 4;

/** A night's log, kept as fixed-size pages so a long night never allocates
 *  one giant array for its entries. Iterable directly - nothing outside
 *  this file needs to know pages exist. */
export class ObservationLog implements Iterable<LogEntry> {
  private readonly pages: LogEntry[][] = [[]];

  append(entry: LogEntry): void {
    const currentPage = this.pages[this.pages.length - 1]!;
    if (currentPage.length === PAGE_SIZE) {
      this.pages.push([entry]);
    } else {
      currentPage.push(entry);
    }
  }

  *[Symbol.iterator](): Generator<LogEntry> {
    for (const page of this.pages) {
      for (const entry of page) {
        yield entry;
      }
    }
  }
}
