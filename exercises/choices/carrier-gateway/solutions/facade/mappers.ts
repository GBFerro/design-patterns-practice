import { aerolaneRate } from "./aerolane-client.ts";
import { coastalEstimate } from "./coastal-client.ts";
import { northbridgeQuote } from "./northbridge-client.ts";
import type { CarrierId, CarrierRate } from "./types.ts";

type Mapper = (originZip: string, destZip: string, weightKg: number) => CarrierRate;

export const mappers: Record<CarrierId, Mapper> = {
  northbridge: (originZip, destZip, weightKg) => {
    const quote = northbridgeQuote(originZip, destZip, weightKg);
    return { cents: quote.totalCents, etaDays: quote.transitDays };
  },
  aerolane: (originZip, destZip, weightKg) => {
    const rate = aerolaneRate({ from: originZip, to: destZip, kg: weightKg });
    return { cents: rate.priceCents, etaDays: rate.days };
  },
  coastal: (originZip, destZip, weightKg) => {
    const raw = coastalEstimate(`${originZip}|${destZip}|${weightKg}`);
    const [cents, etaDays] = raw.split("|").map(Number);
    return { cents: cents!, etaDays: etaDays! };
  },
};
