# Steps — a lookup table

1. `SURCHARGE_TABLE`: one `Record<"fuel" | "remoteArea" | "oversize", (shipment) => number>`
   object literal, one named pure function per surcharge.
2. `quoteSurcharges`: calls `SURCHARGE_TABLE.fuel(shipment)`, `.remoteArea(shipment)`,
   `.oversize(shipment)` directly, sums them.
3. `totalSurchargeCents`: `Object.values(SURCHARGE_TABLE).reduce((total, rule) => total +
   rule(shipment), 0)`.
