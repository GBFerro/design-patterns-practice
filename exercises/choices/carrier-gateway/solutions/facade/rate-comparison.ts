import { carrierGatewayFacade } from "./carrier-gateway-facade.ts";
import type { CarrierId, CarrierRate } from "./types.ts";

export function compareRates(
  carrierIds: readonly CarrierId[],
  originZip: string,
  destZip: string,
  weightKg: number,
): CarrierRate[] {
  return carrierIds.map((carrierId) => carrierGatewayFacade.rate(carrierId, originZip, destZip, weightKg));
}
