import type { LogEntry } from "./types.ts";

const PAGE_SIZE = 4;

/** A night's log, kept as fixed-size pages so a long night never allocates
 *  one giant array for its entries. */
export class ObservationLog {
  private readonly pages: LogEntry[][] = [[]];

  append(entry: LogEntry): void {
    const currentPage = this.pages[this.pages.length - 1]!;
    if (currentPage.length === PAGE_SIZE) {
      this.pages.push([entry]);
    } else {
      currentPage.push(entry);
    }
  }

  get pageCount(): number {
    return this.pages.length;
  }

  entriesInPage(pageIndex: number): number {
    return this.pages[pageIndex]!.length;
  }

  entryAt(pageIndex: number, offset: number): LogEntry {
    return this.pages[pageIndex]![offset]!;
  }
}
