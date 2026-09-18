import { aerolaneRate } from "./aerolane-client.ts";
import { coastalEstimate } from "./coastal-client.ts";
import { northbridgeQuote } from "./northbridge-client.ts";
import type { CarrierGateway, CarrierId, CarrierRate } from "./types.ts";

/**
 * One class, configured per carrier, standing in for whichever native client
 * is behind it. Every caller sees the same `CarrierGateway` shape regardless
 * of which carrier - the translation work happens inside `rate()`, branching
 * on the carrier this instance was built for.
 */
export class CarrierGatewayProxy implements CarrierGateway {
  constructor(private readonly carrierId: CarrierId) {}

  rate(originZip: string, destZip: string, weightKg: number): CarrierRate {
    switch (this.carrierId) {
      case "northbridge": {
        const quote = northbridgeQuote(originZip, destZip, weightKg);
        return { cents: quote.totalCents, etaDays: quote.transitDays };
      }
      case "aerolane": {
        const rate = aerolaneRate({ from: originZip, to: destZip, kg: weightKg });
        return { cents: rate.priceCents, etaDays: rate.days };
      }
      case "coastal": {
        const raw = coastalEstimate(`${originZip}|${destZip}|${weightKg}`);
        const [cents, etaDays] = raw.split("|").map(Number);
        return { cents: cents!, etaDays: etaDays! };
      }
    }
  }
}
