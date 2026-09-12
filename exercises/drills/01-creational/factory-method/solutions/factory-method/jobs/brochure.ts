import type { PrintJob } from "../types.ts";

export class BrochureJob implements PrintJob {
  readonly jobKind = "brochure" as const;

  constructor(
    readonly customerName: string,
    readonly quantity: number,
    readonly foldType: "tri" | "bi",
  ) {}

  describe(): string {
    return `${this.quantity} ${this.foldType}-fold brochures for ${this.customerName}`;
  }

  estimatedMinutes(): number {
    return this.foldType === "tri" ? 12 : 8;
  }
}
