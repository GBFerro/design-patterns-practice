import type {
  BinLocation,
  InventoryRecord,
  InventoryStatus,
  LegacyWmsRecord,
} from "./types.ts";

/** The one place a legacy record becomes a clean inventory record. */
function toInventoryRecord(record: LegacyWmsRecord): InventoryRecord {
  let status: InventoryStatus;
  if (record.statusCode === "A") {
    status = "active";
  } else if (record.statusCode === "H") {
    status = "onHold";
  } else if (record.statusCode === "D") {
    status = "discontinued";
  } else {
    throw new Error(`unknown legacy status code: ${record.statusCode}`);
  }

  const [aisle, shelf, bin] = record.binCode.split("-");
  if (aisle === undefined || shelf === undefined || bin === undefined) {
    throw new Error(`malformed legacy bin code: ${record.binCode}`);
  }
  const location: BinLocation = { aisle, shelf, bin };

  const raw = record.lastUpdatedRaw;
  const lastUpdated = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T${raw.slice(8, 10)}:${raw.slice(10, 12)}:${raw.slice(12, 14)}Z`;

  return {
    sku: record.itemCode,
    quantity: Number.parseInt(record.qtyStr, 10),
    status,
    location,
    lastUpdated,
  };
}

/**
 * The nightly full-file import: every bin location's current record, from
 * the legacy WMS's overnight export, translated into the shape the rest of
 * the app expects.
 */
export function syncInventorySnapshot(
  records: readonly LegacyWmsRecord[],
): readonly InventoryRecord[] {
  return records.map(toInventoryRecord);
}

/**
 * The real-time change-feed listener: one record at a time, as the legacy
 * WMS's polling agent notices a bin changed. Same translation as the
 * nightly import, applied to a single record instead of a file.
 */
export function applyChangeFeedEvent(record: LegacyWmsRecord): InventoryRecord {
  return toInventoryRecord(record);
}
