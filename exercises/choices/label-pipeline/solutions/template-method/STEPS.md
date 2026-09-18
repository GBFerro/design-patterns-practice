# Steps — Template Method

1. `LabelTemplate` abstract class: `sections(shipment)` is the fixed skeleton - header,
   address, weight, then `extras(shipment)`.
2. `header`, `address` and `weight` are private, fixed steps - no subclass ever needs to
   change them.
3. `extras(shipment)`: a `protected` hook, default implementation covers fragile and hazmat
   only.
4. `DomesticLabel extends LabelTemplate`: no overrides needed - the default `extras` is
   already everything a domestic label needs.
5. `InternationalLabel extends LabelTemplate`: overrides `extras` to call `super.extras()`
   and append the customs line.
6. `sections(shipment)` (module-level helper): picks `DomesticLabel` or `InternationalLabel`
   by `shipment.destinationCountry`, calls `.sections(shipment)`.
7. `buildLabel` and `buildManifestEntry` both call the helper and join the result
   differently.
