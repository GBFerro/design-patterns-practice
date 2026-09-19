export type LineKind = "standard" | "bundle" | "serviceFee";

export interface OrderLine {
  readonly kind: LineKind;
  readonly sku: string;
  readonly quantity: number;
  readonly unitPriceCents: number;
}

export interface Order {
  readonly orderId: string;
  readonly lines: readonly OrderLine[];
  readonly isRemoteArea: boolean;
  readonly isOversized: boolean;
}

export interface InvoiceLine {
  readonly sku: string;
  readonly totalCents: number;
}

export interface Invoice {
  readonly orderId: string;
  readonly lines: readonly InvoiceLine[];
  readonly subtotalCents: number;
  readonly surchargeCents: number;
  readonly totalCents: number;
  readonly notifiedChannels: readonly string[];
}
