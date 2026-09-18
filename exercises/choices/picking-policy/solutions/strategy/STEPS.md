# Steps — Strategy

1. Define `RoutingStrategy`: a function from `(queue, orderIds) ->
   PickInstruction`.
2. `individual` and `batch`: the two strategies, holding only the grouping
   logic each mode needs - `individual` ignores `orderIds`, `batch` filters
   the queue down to it first.
3. `strategies`: a `Record<"individual" | "batch", RoutingStrategy>`.
4. `PickingPolicy`: still owns `mode` and `batchOrderIds` as its own
   fields - nothing about picking a strategy removes the need to track
   which mode is active, or which orders belong to the current batch. It
   checks the threshold, updates `mode`/`batchOrderIds` when it changes,
   and calls `strategies[mode](queue, batchOrderIds)`.
5. `picking-policy.ts`: one module-level `PickingPolicy`, exported the
   same way `src/` does.
