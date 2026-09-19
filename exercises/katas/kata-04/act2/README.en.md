[🌐 English](./README.en.md)

# Act 2 — low-value invoices need a review flag

Compliance has a new rule: any invoice totaling under 500 cents (five dollars) also notifies a
new `"low-value-review"` channel, in addition to whichever channels already apply. Everything
else about notification is unchanged, and nothing about how a line is built or how surcharges
are computed changes at all.

## Done when (act 2)

- `./dp test kata-04 --act2 --solution <your-route>` is green.
- An invoice totaling under 500 cents also notifies `"low-value-review"`.
- An invoice totaling exactly 500 cents or more does not notify `"low-value-review"`.
- `"accounting-ledger"` and `"large-order-desk"` still fire under exactly the rules they do
  today, on every invoice, regardless of the new rule.
- Line construction and surcharge calculation behave exactly as they do today.

## Then run `./dp trade kata-04`
