import { analyticsLink, emailLink, inventoryLink, smsLink, type Link } from "./links.ts";
import type { Order } from "./types.ts";

const links: readonly Link[] = [inventoryLink, analyticsLink, emailLink, smsLink];

function runChain(order: Order): void {
  for (const link of links) {
    if (!link(order)) break;
  }
}

export function orderShipped(order: Order): void {
  runChain(order);
}

export function resendOrderNotifications(order: Order): void {
  runChain(order);
}
