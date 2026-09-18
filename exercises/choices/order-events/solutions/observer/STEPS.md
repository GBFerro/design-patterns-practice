# Steps — Observer

1. `OrderObserver`: one-method interface, `notify(order): void`.
2. `EmailObserver`, `SmsObserver`, `InventoryObserver`, `AnalyticsObserver`: four small
   classes, each wrapping exactly one consumer, none aware the others exist.
3. `OrderShippedSubject`: holds a list of subscribers, `subscribe(observer)`, and
   `notifyAll(order)` walks the list in subscription order.
4. `order-events.ts`: one module-level `subject`, subscribed in the act-1 order - inventory,
   analytics, email, sms.
5. `orderShipped` and `resendOrderNotifications` both call `subject.notifyAll(order)` and do
   nothing else.
