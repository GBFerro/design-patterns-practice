import { mappers } from "./mappers.ts";
import type { CarrierId, CarrierRate } from "./types.ts";

function validate(originZip: string, destZip: string, weightKg: number): void {
  if (!/^\d{5}$/.test(originZip) || !/^\d{5}$/.test(destZip)) {
    throw new Error("zip codes must be 5 digits");
  }
  if (weightKg <= 0) throw new Error("weight must be positive");
}

/**
 * One simplified entry point over the whole carrier subsystem: validate,
 * then dispatch to whichever mapper the carrier needs. Unlike an adapter or
 * a proxy, this doesn't implement `CarrierGateway` per carrier - it's a
 * single operation over the subsystem as a whole, which is why it takes
 * `carrierId` as an argument instead of being built with one.
 */
export class CarrierGatewayFacade {
  rate(carrierId: CarrierId, originZip: string, destZip: string, weightKg: number): CarrierRate {
    validate(originZip, destZip, weightKg);
    return mappers[carrierId](originZip, destZip, weightKg);
  }
}

export const carrierGatewayFacade = new CarrierGatewayFacade();
