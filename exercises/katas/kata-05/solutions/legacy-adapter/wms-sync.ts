import type { InventoryRecord, LegacyWmsRecord } from "./types.ts";
import { LegacyWmsAdapter } from "./adapter.ts";

const adapter = new LegacyWmsAdapter();

/**
 * The nightly full-file import: every bin location's current record, from
 * the legacy WMS's overnight export, translated into the shape the rest of
 * the app expects.
 */
export function syncInventorySnapshot(
  records: readonly LegacyWmsRecord[],
): readonly InventoryRecord[] {
  return records.map((record) => adapter.read(record));
}

/**
 * The real-time change-feed listener: one record at a time, as the legacy
 * WMS's polling agent notices a bin changed. Same translation as the
 * nightly import, applied to a single record instead of a file.
 */
export function applyChangeFeedEvent(record: LegacyWmsRecord): InventoryRecord {
  return adapter.read(record);
}
