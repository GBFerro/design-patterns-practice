# Steps — a pipeline of functions

1. `Stage`: a function type, `(shipment) -> string | null` - `null` means "this shipment
   doesn't need this line."
2. `header`, `address`, `weight`, `fragileWarning`, `hazmatWarning`, `customsDeclaration`:
   six small `Stage` values, each one a pure function.
3. `stages`: one fixed array, `[header, address, weight, fragileWarning, hazmatWarning,
   customsDeclaration]` - the array *is* the order.
4. `sections(shipment)`: maps every stage over the shipment, filters out the `null`s.
5. `buildLabel` and `buildManifestEntry` both call `sections(shipment)` and join the result
   differently.
