# Steps — translation-function

1. `toInventoryRecord(record)`: one function, pulled out of both `syncInventorySnapshot` and
   `applyChangeFeedEvent`, deciding what a single legacy record becomes - status, location,
   timestamp, quantity, all of it.
2. `syncInventorySnapshot` becomes `records.map(toInventoryRecord)`; `applyChangeFeedEvent`
   becomes `return toInventoryRecord(record)`. Neither entry point keeps its own copy of the
   translation rules.
