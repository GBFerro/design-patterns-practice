import { coastalEstimate } from "../coastal-client.ts";
import type { CarrierGateway, CarrierRate } from "../types.ts";

export class CoastalAdapter implements CarrierGateway {
  rate(originZip: string, destZip: string, weightKg: number): CarrierRate {
    const raw = coastalEstimate(`${originZip}|${destZip}|${weightKg}`);
    const [cents, etaDays] = raw.split("|").map(Number);
    return { cents: cents!, etaDays: etaDays! };
  }
}
