import { CarrierGatewayProxy } from "./carrier-gateway-proxy.ts";
import type { CarrierGateway, CarrierId } from "./types.ts";

export const gateways: Record<CarrierId, CarrierGateway> = {
  northbridge: new CarrierGatewayProxy("northbridge"),
  aerolane: new CarrierGatewayProxy("aerolane"),
  coastal: new CarrierGatewayProxy("coastal"),
};
