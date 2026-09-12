import type { PrintJob } from "../types.ts";

export class BusinessCardJob implements PrintJob {
  readonly jobKind = "business-cards" as const;

  constructor(
    readonly customerName: string,
    readonly quantity: number,
    readonly doubleSided: boolean,
  ) {}

  describe(): string {
    const side = this.doubleSided ? " (double-sided)" : "";
    return `${this.quantity} business cards for ${this.customerName}${side}`;
  }

  estimatedMinutes(): number {
    return 5 + (this.doubleSided ? 3 : 0);
  }
}
