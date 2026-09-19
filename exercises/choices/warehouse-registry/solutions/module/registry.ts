import type { BinLocation } from "./types.ts";

/** The one array every function below reads and writes - a module has
 *  exactly one instance per process, the same guarantee a singleton class
 *  makes, without the class ceremony. */
let bins: BinLocation[] = [];

export function registerBin(bin: BinLocation): void {
  bins.push(bin);
}

export function binLocation(binId: string): BinLocation | undefined {
  return bins.find((bin) => bin.binId === binId);
}

export function binsInAisle(aisle: string): readonly BinLocation[] {
  return bins.filter((bin) => bin.aisle === aisle);
}

export function resetRegistry(): void {
  bins = [];
}
