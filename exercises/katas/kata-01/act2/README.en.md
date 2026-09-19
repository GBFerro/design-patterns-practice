[🌐 English](./README.en.md)

# Act 2 — a recall arrives

Ravensgate's supplier issues a recall on one SKU. Every unit already sold has to come back,
and Ravensgate's finance team has set the rule: a **recalled** item is refunded in full, to
the customer's original payment method, regardless of what condition it comes back in —
sealed, opened, or damaged, the refund is the same. One exception: a recalled item priced
above $500 has its refund capped at $500 within this engine; anything above that cap is
issued through a separate manual process outside `processReturn`'s scope.

Nothing about how the item gets restocked or how the customer is notified changes. A
recalled item still goes through the same restock disposition your condition already
decides, and the same notification channel your refund method already decides.

Add `"recalled"` to `ReturnReason` and give it this refund rule.

## Done when (act 2)

- `./dp test kata-01 --act2 --solution <your-route>` is green.
- A recalled item is refunded in full to the original payment method, capped at 50000 cents.
- A recalled item's restock disposition and notification channel are exactly what they would
  have been for any other reason with the same condition and refund method — nothing about
  those two decisions changes for this reason.

## Then run `./dp trade kata-01`
