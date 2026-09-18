import { AerolaneAdapter } from "./adapters/aerolane-adapter.ts";
import { CoastalAdapter } from "./adapters/coastal-adapter.ts";
import { NorthbridgeAdapter } from "./adapters/northbridge-adapter.ts";
import type { CarrierGateway, CarrierId } from "./types.ts";

export const gateways: Record<CarrierId, CarrierGateway> = {
  northbridge: new NorthbridgeAdapter(),
  aerolane: new AerolaneAdapter(),
  coastal: new CoastalAdapter(),
};
