import { getSettings } from "./settings.ts";

export function rushQuoteTotal(baseCost: number): number {
  return baseCost * (1 + getSettings().rushSurchargePercent / 100);
}
