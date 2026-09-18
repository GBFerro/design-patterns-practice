# Steps — Decorator

1. `LabelRenderer` interface: one method, `render(shipment) -> string[]`.
2. `BaseLabelRenderer implements LabelRenderer`: the mandatory content - header, address,
   weight - as one fixed array.
3. `FragileWarningDecorator`, `HazmatWarningDecorator`, `CustomsDeclarationDecorator`: each
   wraps a `LabelRenderer`, calls `wrapped.render()` first, and appends its own line only if
   its own condition holds.
4. `sections(shipment)`: builds one fixed chain -
   `CustomsDeclarationDecorator(HazmatWarningDecorator(FragileWarningDecorator(BaseLabelRenderer())))`
   - and calls `.render(shipment)`.
5. `buildLabel` and `buildManifestEntry` both call `sections(shipment)` and join the result
   differently - `"\n"` for one, `" | "` for the other.
