[🌐 English](./README.en.md)

# Act 2 — a third reader, with a third shape

Caldermoor is piloting a contactless reader at one station. It has
nothing in common with either existing shape: `poll(): string |
undefined`, returning `undefined` when nothing is presented, or a raw
string like `"CARD-777,1000"` (card id, then balance in cents,
comma-separated) when a card is.

Add `admitContactlessPassenger(reader: ContactlessReader): AdmissionResult`,
applying the exact same fare rule as the other two entry points.
