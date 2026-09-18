import { northbridgeQuote } from "../northbridge-client.ts";
import type { CarrierGateway, CarrierRate } from "../types.ts";

export class NorthbridgeAdapter implements CarrierGateway {
  rate(originZip: string, destZip: string, weightKg: number): CarrierRate {
    const quote = northbridgeQuote(originZip, destZip, weightKg);
    return { cents: quote.totalCents, etaDays: quote.transitDays };
  }
}
