# Steps — Template Method

1. `PickingRound.pick(queue)`: the skeleton - `selectCandidates`, then
   group the result around its oldest member. `mode` and
   `selectCandidates` are the two things a subclass supplies.
2. `IndividualRound`: `selectCandidates` returns the whole queue.
3. `BatchRound`: holds an order-id set, `selectCandidates` filters the
   queue down to it.
4. `PickingPolicy`: still owns `mode` and `batchOrderIds` itself - a round
   only knows how to compute one instruction, not when to become a
   different round. It checks the threshold, updates its own fields, then
   constructs whichever round is current and calls `.pick(queue)`.
5. `picking-policy.ts`: one module-level `PickingPolicy`, exported the
   same way `src/` does.
