# Steps — notification-routing

1. `notifiedChannelsFor(totalCents)`: one function, pulled out of both `finalizeInvoice` and
   `finalizeInvoiceBatch`, deciding which channels need to hear about an invoice of this total.
2. `finalizeInvoice` and `finalizeInvoiceBatch` each call `notifiedChannelsFor` once, then keep
   their own copies of the line-construction and surcharge logic exactly as `src/` has them -
   untouched, on purpose.
