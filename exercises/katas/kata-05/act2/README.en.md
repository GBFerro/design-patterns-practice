[🌐 English](./README.en.md)

# Act 2 — pending inspection

The legacy WMS adds a fifth status code: `"P"`, for a bin flagged **pending inspection** after
a cycle-count discrepancy. It is not a return, not a hold, and not a discontinuation — it's a
new state, and it comes with a rule attached: a pending-inspection record's quantity must
report as `0` in `InventoryRecord`, no matter what the legacy file says, because the physical
count on that bin is not trusted until inspection clears it.

## What changes

- `"P"` maps to a new `InventoryStatus` value: `"pendingInspection"`.
- Whenever the resulting status is `"pendingInspection"`, `quantity` is `0`, regardless of
  `qtyStr`.
- Every other status keeps behaving exactly as it does today, in both `syncInventorySnapshot`
  and `applyChangeFeedEvent`.

## Not in scope

- No change to how the bin location or timestamp are parsed.
- No change to what happens to an already-`active` or `-onHold` record.
- No new entry point, no new export.

Run `./dp diff kata-05 --all` once you've made this change, against whichever restructuring you
did in act 1.
