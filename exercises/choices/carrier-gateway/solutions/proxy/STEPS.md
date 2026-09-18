# Steps — Proxy

1. `CarrierGatewayProxy implements CarrierGateway`, constructor takes one
   `carrierId`. One class, not three.
2. `rate()` switches on `this.carrierId` internally, translating whichever
   native client this instance was built for.
3. `registry.ts`: a `Record<CarrierId, CarrierGateway>`, built once, each
   entry a separate `new CarrierGatewayProxy(carrierId)` - three instances
   of the same class.
4. `checkout.ts` and `rate-comparison.ts`: identical to the adapter route -
   both collapse to `gateways[carrierId].rate(originZip, destZip, weightKg)`.
5. `index.ts`: unchanged export surface.
