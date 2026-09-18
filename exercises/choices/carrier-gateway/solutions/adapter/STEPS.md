# Steps — Adapter

1. `CarrierGateway` already exists, frozen, in `types.ts`: one method,
   `rate(originZip, destZip, weightKg) -> CarrierRate`.
2. `NorthbridgeAdapter`, `AerolaneAdapter`, `CoastalAdapter`: one class per
   carrier, each `implements CarrierGateway`, each wrapping exactly one
   native client and translating exactly one shape.
3. `registry.ts`: a `Record<CarrierId, CarrierGateway>` built once, mapping
   each carrier id to its adapter instance.
4. `checkout.ts` and `rate-comparison.ts`: both if/else chains collapse to
   `gateways[carrierId].rate(originZip, destZip, weightKg)`. Neither
   function knows any carrier's native shape any more.
5. `index.ts`: unchanged export surface.
