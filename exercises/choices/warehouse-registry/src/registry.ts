import type { BinLocation } from "./types.ts";

let bins: BinLocation[] | undefined;

export function registerBin(bin: BinLocation): void {
  if (bins === undefined) {
    bins = [];
  }
  bins.push(bin);
}

export function binLocation(binId: string): BinLocation | undefined {
  if (bins === undefined) {
    bins = [];
  }
  return bins.find((bin) => bin.binId === binId);
}

export function binsInAisle(aisle: string): readonly BinLocation[] {
  if (bins === undefined) {
    bins = [];
  }
  return bins.filter((bin) => bin.aisle === aisle);
}

export function resetRegistry(): void {
  bins = undefined;
}
