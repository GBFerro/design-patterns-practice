# Steps — State

1. Define `PolicyState`: `name`, `plan(queue) -> { instruction, next }`,
   `recordPicked(orderId) -> PolicyState`.
2. `IndividualState`: below the threshold, plans one order; at the
   threshold, builds a `BatchState` with a frozen snapshot of the queue's
   ids and delegates to it immediately.
3. `BatchState`: holds the batch's own order-id set. `plan` groups the
   surviving members by the oldest one's bin. `recordPicked` shrinks the
   set and returns a fresh `IndividualState` once it's empty, `this`
   otherwise.
4. `PickingPolicy`: holds one `state` field, delegates `planNextPick` and
   `recordPicked` to it, replaces the field with whatever `next` came back.
5. `picking-policy.ts`: one module-level `PickingPolicy`, exported as the
   same four free functions `src/` already exposes.
