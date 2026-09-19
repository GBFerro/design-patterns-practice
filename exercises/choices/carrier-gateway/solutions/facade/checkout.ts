import { carrierGatewayFacade } from "./carrier-gateway-facade.ts";
import type { CarrierId, CarrierRate } from "./types.ts";

export function checkoutRate(
  carrierId: CarrierId,
  originZip: string,
  destZip: string,
  weightKg: number,
): CarrierRate {
  return carrierGatewayFacade.rate(carrierId, originZip, destZip, weightKg);
}
