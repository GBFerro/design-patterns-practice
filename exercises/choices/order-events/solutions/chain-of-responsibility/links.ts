import {
  recordAnalyticsEvent,
  sendConfirmationEmail,
  sendSmsNotification,
  updateInventoryCount,
} from "./consumers.ts";
import type { Order } from "./types.ts";

/** A link runs its own side effect and returns whether the chain should continue. */
export type Link = (order: Order) => boolean;

export const inventoryLink: Link = (order) => {
  updateInventoryCount(order);
  return true;
};

export const analyticsLink: Link = (order) => {
  recordAnalyticsEvent(order);
  return true;
};

export const emailLink: Link = (order) => {
  sendConfirmationEmail(order);
  return true;
};

export const smsLink: Link = (order) => {
  sendSmsNotification(order);
  return true;
};
