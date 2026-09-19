import type { BinLocation } from "./types.ts";

/** Everything the app can do with one warehouse's bin registry - every
 *  method closes over the array this registry was built from, never a
 *  shared global. */
export interface WarehouseRegistryHandle {
  registerBin(bin: BinLocation): void;
  binLocation(binId: string): BinLocation | undefined;
  binsInAisle(aisle: string): readonly BinLocation[];
  clear(): void;
}

/** Builds one independent bin registry. Calling this twice gives two
 *  registries that cannot see or change each other's bins. */
export function createWarehouseRegistry(): WarehouseRegistryHandle {
  let bins: BinLocation[] = [];
  return {
    registerBin(bin) {
      bins.push(bin);
    },
    binLocation(binId) {
      return bins.find((b) => b.binId === binId);
    },
    binsInAisle(aisle) {
      return bins.filter((b) => b.aisle === aisle);
    },
    clear() {
      bins = [];
    },
  };
}

/** The registry the rest of the app uses by default - built once, here,
 *  the same way any other registry would be. */
const mainSite = createWarehouseRegistry();

export const registerBin = mainSite.registerBin;
export const binLocation = mainSite.binLocation;
export const binsInAisle = mainSite.binsInAisle;
export const resetRegistry = mainSite.clear;
