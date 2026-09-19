import type {
  BinLocation,
  InventoryRecord,
  InventoryStatus,
  LegacyWmsRecord,
} from "./types.ts";

/**
 * The nightly full-file import: every bin location's current record, from
 * the legacy WMS's overnight export, translated into the shape the rest of
 * the app expects.
 */
export function syncInventorySnapshot(
  records: readonly LegacyWmsRecord[],
): readonly InventoryRecord[] {
  const out: InventoryRecord[] = [];

  for (const record of records) {
    // status
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

    // location
    const [aisle, shelf, bin] = record.binCode.split("-");
    if (aisle === undefined || shelf === undefined || bin === undefined) {
      throw new Error(`malformed legacy bin code: ${record.binCode}`);
    }
    const location: BinLocation = { aisle, shelf, bin };

    // timestamp
    const raw = record.lastUpdatedRaw;
    const lastUpdated = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T${raw.slice(8, 10)}:${raw.slice(10, 12)}:${raw.slice(12, 14)}Z`;

    out.push({
      sku: record.itemCode,
      quantity: Number.parseInt(record.qtyStr, 10),
      status,
      location,
      lastUpdated,
    });
  }

  return out;
}

/**
 * The real-time change-feed listener: one record at a time, as the legacy
 * WMS's polling agent notices a bin changed. Same translation as the
 * nightly import, applied to a single record instead of a file.
 */
export function applyChangeFeedEvent(record: LegacyWmsRecord): InventoryRecord {
  // status
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

  // location
  const [aisle, shelf, bin] = record.binCode.split("-");
  if (aisle === undefined || shelf === undefined || bin === undefined) {
    throw new Error(`malformed legacy bin code: ${record.binCode}`);
  }
  const location: BinLocation = { aisle, shelf, bin };

  // timestamp
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
