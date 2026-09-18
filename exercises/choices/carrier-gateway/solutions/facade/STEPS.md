# Steps — Facade

1. `mappers.ts`: a `Record<CarrierId, Mapper>` of pure translation
   functions - no classes, no `CarrierGateway` implementations, just one
   function per carrier's shape.
2. `CarrierGatewayFacade`: one class, one method,
   `rate(carrierId, originZip, destZip, weightKg)`. Takes `carrierId` as
   an argument rather than being built around one, because this is a
   single operation over the subsystem as a whole, not a per-carrier
   stand-in.
3. `rate()` validates its input first (`validate()` - five-digit zips, a
   positive weight) and only then dispatches to `mappers[carrierId]`.
   Neither `src/` nor the other two candidates validate at all.
4. A module-level singleton, `carrierGatewayFacade`, exported alongside
   the class.
5. `checkout.ts` and `rate-comparison.ts`: both call
   `carrierGatewayFacade.rate(carrierId, originZip, destZip, weightKg)`.
6. `index.ts`: unchanged export surface.
