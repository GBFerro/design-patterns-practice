# Steps — Mediator

1. `OrderEventsMediator`: one class, one method, `dispatch(order)` - the single place that
   knows all four consumers and the order they run in.
2. `dispatch()` calls `updateInventoryCount`, `recordAnalyticsEvent`,
   `sendConfirmationEmail`, `sendSmsNotification`, in that order - the exact act-1 sequence,
   just named once instead of written out twice.
3. A module-level singleton, `mediator`, in `order-events.ts`.
4. `orderShipped` and `resendOrderNotifications` both call `mediator.dispatch(order)` and do
   nothing else.
5. `index.ts`: unchanged export surface.
