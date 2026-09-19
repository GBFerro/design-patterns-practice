# Steps — line-construction

1. `buildInvoiceLine(orderLine)`: one function, pulled out of both `finalizeInvoice` and
   `finalizeInvoiceBatch`, deciding what a single order line becomes on the invoice, by kind.
2. `finalizeInvoice` and `finalizeInvoiceBatch` each call `order.lines.map(buildInvoiceLine)`
   where they used to inline the same kind-by-kind logic, then keep their own copies of the
   surcharge and notification logic exactly as `src/` has them - untouched, on purpose.
