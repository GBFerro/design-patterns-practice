[🌐 English](./README.en.md)

# Act 2 — a third mode

A hot bin has started appearing mid-batch: while the floor is already working
a batch, three or more orders that are **not** part of that batch pile up
waiting. Those can't wait for the current batch to finish - they need to be
picked next, ahead of the batch that's already in progress.

## The requirement

- Add a `surge` mode. It triggers only from `batch` mode, when the number of
  queued orders that are **not** part of the current batch reaches 3.
- While surging, `planNextPick` groups and returns the waiting orders the
  same way `batch` mode already groups its own orders (oldest first, by
  shared bin) - but the instruction is flagged `urgent: true`.
- `recordPicked` on a surging order shrinks the surge group, not the
  suspended batch.
- Once the surge group is fully picked, the policy falls back to `batch`
  mode - **never straight to `individual`** - and resumes the batch exactly
  where it left off.
- Every existing act 1 behaviour keeps working: outside of a surge, nothing
  about individual or batch mode changes.

## Done when (act 2)

- `./dp test picking-policy --act2 --solution <your-candidate>` is green.
- `currentMode()` reports `"surge"` while a surge is active.
- `PickInstruction.urgent` is `true` only for a surge instruction - every
  other instruction omits it or leaves it falsy, so nothing that already
  reads a `PickInstruction` without knowing about `urgent` breaks.

## Then run `./dp trade picking-policy`
