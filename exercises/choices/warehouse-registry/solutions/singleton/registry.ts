import type { BinLocation } from "./types.ts";

/** The one bin registry this module hands out - built once, on first use,
 *  and shared by every caller after that. The constructor is private:
 *  `getInstance()` is the only way in. */
export class WarehouseRegistry {
  private static instance: WarehouseRegistry | undefined;
  private bins: BinLocation[] = [];

  private constructor() {}

  static getInstance(): WarehouseRegistry {
    if (WarehouseRegistry.instance === undefined) {
      WarehouseRegistry.instance = new WarehouseRegistry();
    }
    return WarehouseRegistry.instance;
  }

  static resetForTests(): void {
    WarehouseRegistry.instance = undefined;
  }

  registerBin(bin: BinLocation): void {
    this.bins.push(bin);
  }

  binLocation(binId: string): BinLocation | undefined {
    return this.bins.find((bin) => bin.binId === binId);
  }

  binsInAisle(aisle: string): readonly BinLocation[] {
    return this.bins.filter((bin) => bin.aisle === aisle);
  }
}

export function registerBin(bin: BinLocation): void {
  WarehouseRegistry.getInstance().registerBin(bin);
}

export function binLocation(binId: string): BinLocation | undefined {
  return WarehouseRegistry.getInstance().binLocation(binId);
}

export function binsInAisle(aisle: string): readonly BinLocation[] {
  return WarehouseRegistry.getInstance().binsInAisle(aisle);
}

export function resetRegistry(): void {
  WarehouseRegistry.resetForTests();
}
