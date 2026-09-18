# Steps — Chain of Responsibility

1. `Link`: a function type, `(order) -> boolean` - `true` means "keep going," `false` stops
   the chain.
2. `inventoryLink`, `analyticsLink`, `emailLink`, `smsLink`: four small `Link` values, each
   running its consumer and returning `true`.
3. `links`: one fixed array, `[inventoryLink, analyticsLink, emailLink, smsLink]` - the array
   *is* the order.
4. `runChain(order)`: walks `links`, calling each one and stopping the moment one returns
   `false`.
5. `orderShipped` and `resendOrderNotifications` both call `runChain(order)` and do nothing
   else.
