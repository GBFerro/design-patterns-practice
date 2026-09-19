/**
 * The shape the legacy WMS actually sends - fixed-width codes, zero-padded
 * numbers, a positional timestamp string. None of this is ours to change;
 * it is a nightly-file export format nobody has touched since before this
 * team existed.
 */
export interface LegacyWmsRecord {
  readonly itemCode: string; // e.g. "SKU-00231"
  readonly qtyStr: string; // zero-padded, e.g. "00042"
  readonly statusCode: string; // "A" | "H" | "D"
  readonly binCode: string; // "A-12-03" (aisle-shelf-bin)
  readonly lastUpdatedRaw: string; // "20250131235959" (YYYYMMDDHHmmss, UTC)
}

export type InventoryStatus = "active" | "onHold" | "discontinued";

export interface BinLocation {
  readonly aisle: string;
  readonly shelf: string;
  readonly bin: string;
}

/** The clean shape everything downstream of this module actually wants. */
export interface InventoryRecord {
  readonly sku: string;
  readonly quantity: number;
  readonly status: InventoryStatus;
  readonly location: BinLocation;
  readonly lastUpdated: string; // ISO 8601
}
