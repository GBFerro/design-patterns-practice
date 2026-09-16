export interface StopDirectoryEntry {
  readonly name: string;
  readonly zone: string;
  readonly wheelchairAccessible: boolean;
}

/** The master data: every physical stop Caldermoor runs. Small, and stays small - the
 *  timetable is the thing that grows. */
export const STOP_DIRECTORY: Record<string, StopDirectoryEntry> = {
  "mill-ave": { name: "Mill Ave", zone: "A", wheelchairAccessible: true },
  "harbor-sq": { name: "Harbor Square", zone: "A", wheelchairAccessible: false },
  castleview: { name: "Castleview", zone: "B", wheelchairAccessible: true },
};
