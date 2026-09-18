import { aerolaneRate } from "../aerolane-client.ts";
import type { CarrierGateway, CarrierRate } from "../types.ts";

export class AerolaneAdapter implements CarrierGateway {
  rate(originZip: string, destZip: string, weightKg: number): CarrierRate {
    const rate = aerolaneRate({ from: originZip, to: destZip, kg: weightKg });
    return { cents: rate.priceCents, etaDays: rate.days };
  }
}
