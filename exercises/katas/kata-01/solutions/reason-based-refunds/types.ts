export type ReturnReason = "defective" | "wrong-item" | "changed-mind";

export type ItemCondition = "sealed" | "opened-good" | "opened-damaged";

export interface ReturnRequest {
  readonly returnId: string;
  readonly orderId: string;
  readonly itemSku: string;
  readonly itemPriceCents: number;
  readonly reason: ReturnReason;
  readonly condition: ItemCondition;
}

export type RefundMethod = "original-payment" | "store-credit";

export type RestockDisposition = "restock-new" | "restock-open-box" | "scrap";

export type NotificationChannel = "sms" | "email";

export interface ReturnOutcome {
  readonly returnId: string;
  readonly refundCents: number;
  readonly refundMethod: RefundMethod;
  readonly restockDisposition: RestockDisposition;
  readonly notificationChannel: NotificationChannel;
}
