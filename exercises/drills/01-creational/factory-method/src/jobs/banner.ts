import type { PrintJob } from "../types.ts";

export class BannerJob implements PrintJob {
  readonly jobKind = "banner" as const;

  constructor(
    readonly customerName: string,
    readonly quantity: number,
    readonly widthCm: number,
  ) {}

  describe(): string {
    return `${this.quantity} banner(s), ${this.widthCm}cm wide, for ${this.customerName}`;
  }

  estimatedMinutes(): number {
    return 15 + Math.floor(this.widthCm / 30);
  }
}
