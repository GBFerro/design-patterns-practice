import { aerolaneRate } from "./aerolane-client.ts";
import { coastalEstimate } from "./coastal-client.ts";
import { northbridgeQuote } from "./northbridge-client.ts";
import type { CarrierId, CarrierRate } from "./types.ts";

export function checkoutRate(
  carrierId: CarrierId,
  originZip: string,
  destZip: string,
  weightKg: number,
): CarrierRate {
  if (carrierId === "northbridge") {
    const quote = northbridgeQuote(originZip, destZip, weightKg);
    return { cents: quote.totalCents, etaDays: quote.transitDays };
  }
  if (carrierId === "aerolane") {
    const rate = aerolaneRate({ from: originZip, to: destZip, kg: weightKg });
    return { cents: rate.priceCents, etaDays: rate.days };
  }
  const raw = coastalEstimate(`${originZip}|${destZip}|${weightKg}`);
  const [cents, etaDays] = raw.split("|").map(Number);
  return { cents: cents!, etaDays: etaDays! };
}
