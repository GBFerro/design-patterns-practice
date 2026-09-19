# Steps — condition-based-restock

1. `dispositionFor(condition)`: one function, pulled out of both `processReturn` and
   `processBulkReturns`, deciding `restockDisposition` from `request.condition` alone.
2. `processReturn` and `processBulkReturns` each call `dispositionFor` once, then keep their
   own copies of the refund-by-reason and notification-channel branching exactly as `src/`
   has them - untouched, on purpose.
