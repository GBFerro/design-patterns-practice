# Steps — a rules list

1. `SurchargeRule`: one interface, `readonly id` and `amount(shipment, soFar): number`, where
   `soFar` is every surcharge already computed earlier in the list.
2. `SURCHARGE_RULES`: `readonly SurchargeRule[]`, in application order - `fuel`, `remoteArea`,
   `oversize`.
3. `applyRules(shipment)`: one `for` loop, building an accumulator object keyed by `id`, each
   rule's `amount` receiving that accumulator so far.
4. `quoteSurcharges`/`totalSurchargeCents`: both call `applyRules`, then extract fields or sum
   `Object.values`.
