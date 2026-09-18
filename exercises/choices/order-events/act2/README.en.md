[🌐 English](./README.en.md)

# Act 2 — a fraud hold

Ravensgate is adding a fraud check before an order's shipment notifications go out. A new,
frozen function - `fraudCheck(order)` - decides whether an order is held.

- If the order is **held**, the customer-facing notifications - the confirmation email and the
  SMS - must **not** fire.
- The internal bookkeeping - the inventory update and the analytics event - must fire exactly
  as before, held or not. Ravensgate still needs an accurate count and an accurate record of
  every shipment, flagged or clean.
- A clean order's four consumers still fire in exactly the order act 1 left them:
  inventory, then analytics, then email, then SMS.

## Done when (act 2)

- `./dp test order-events --act2 --solution <your-candidate>` is green.
- A held order calls exactly `inventory` and `analytics` - nothing else.
- A clean order still calls all four, in the act-1 order.
- Both `orderShipped` and `resendOrderNotifications` respect the hold identically.

## Then run `./dp trade order-events`
