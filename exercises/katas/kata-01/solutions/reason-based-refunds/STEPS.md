# Steps — reason-based-refunds

1. `refundFor(request)`: one function, pulled out of both `processReturn` and
   `processBulkReturns`, deciding `refundCents` and `refundMethod` from `request.reason`
   alone.
2. `processReturn` and `processBulkReturns` each call `refundFor` once, then keep their own
   copies of the restock-disposition and notification-channel branching exactly as `src/`
   has them - untouched, on purpose.
