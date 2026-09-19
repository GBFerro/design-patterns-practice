import type { BinLocation, InventoryRecord, InventoryStatus, LegacyWmsRecord } from "./types.ts";

/** Anything that can turn a legacy WMS record into a clean inventory record. */
export interface InventoryReader {
  read(record: LegacyWmsRecord): InventoryRecord;
}

const SUPPORTED_STATUS_CODES: readonly string[] = ["A", "H", "D"];

/**
 * Wraps the legacy WMS's record shape behind the `InventoryReader`
 * interface. Advertises which status codes it knows how to translate
 * (`supportedStatusCodes`), so a caller behind the interface can check
 * compatibility before calling `read()` instead of catching a thrown
 * error - and keeps a running count of how many records it has
 * translated, which the nightly job logs on completion and the
 * change-feed listener reports on its health check.
 */
export class LegacyWmsAdapter implements InventoryReader {
  private translatedCount = 0;

  get supportedStatusCodes(): readonly string[] {
    return SUPPORTED_STATUS_CODES;
  }

  get recordsTranslated(): number {
    return this.translatedCount;
  }

  read(record: LegacyWmsRecord): InventoryRecord {
    const status = this.mapStatus(record.statusCode);
    const location = this.parseLocation(record.binCode);
    const lastUpdated = this.parseTimestamp(record.lastUpdatedRaw);

    this.translatedCount += 1;

    return {
      sku: record.itemCode,
      quantity: Number.parseInt(record.qtyStr, 10),
      status,
      location,
      lastUpdated,
    };
  }

  private mapStatus(code: string): InventoryStatus {
    switch (code) {
      case "A":
        return "active";
      case "H":
        return "onHold";
      case "D":
        return "discontinued";
      default:
        throw new Error(`unknown legacy status code: ${code}`);
    }
  }

  private parseLocation(binCode: string): BinLocation {
    const [aisle, shelf, bin] = binCode.split("-");
    if (aisle === undefined || shelf === undefined || bin === undefined) {
      throw new Error(`malformed legacy bin code: ${binCode}`);
    }
    return { aisle, shelf, bin };
  }

  private parseTimestamp(raw: string): string {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T${raw.slice(8, 10)}:${raw.slice(10, 12)}:${raw.slice(12, 14)}Z`;
  }
}
