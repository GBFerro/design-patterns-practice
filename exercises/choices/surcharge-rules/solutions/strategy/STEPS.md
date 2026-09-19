# Steps — Strategy

1. `Surcharge`: one interface, `readonly id` and `compute(shipment): number`.
2. `FuelSurcharge`/`RemoteAreaSurcharge`/`OversizeSurcharge` implement it, each computing its
   own amount from the shipment alone.
3. `SURCHARGES`: `readonly Surcharge[]`, one instance of each class.
4. `quoteSurcharges`/`totalSurchargeCents`: iterate `SURCHARGES`, summing (and, for the
   itemised quote, collecting by `id`).
