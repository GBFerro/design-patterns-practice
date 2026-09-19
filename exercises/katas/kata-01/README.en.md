[🌐 English](./README.en.md)

# Ravensgate returns and refunds engine

`Kata` · ~45 min

## Context

A customer returns an item, at the counter or through Ravensgate's own self-service flow.
Three things have to be decided every time: how much comes back and by what method, what
happens to the returned item itself, and how the customer hears about the outcome. The same
logic also runs every night in one pass, over every return the warehouse scanned in that day.

## The pressure

`processReturn` and `processBulkReturns` each make the same three decisions, branch for
branch, independently of each other. None of the three is obviously the one to fix: the
refund varies by reason, the restock disposition varies by condition, the notification
channel follows from whichever refund method was decided. Pick one to restructure and the
other two stay exactly as duplicated as they are today.

## Done when (act 1)

- `./dp test kata-01` is green throughout, against your `src/`.
- `processReturn`, `processBulkReturns` and every field on `ReturnOutcome` behave exactly as
  they do today. This is a restructuring, not a rewrite.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 kata-01`

## Hints

<details>
<summary>Do all three decisions have to move together?</summary>

No. Nothing says the refund, the restock disposition and the notification channel have to be
restructured in the same commit, or even in the same way. Pick the one pressure that bothers
you most and leave the other two alone - that is a legitimate, complete answer to act 1.

</details>

<details>
<summary>What's actually duplicated between the two entry points?</summary>

Every branch, twice - once inside `processReturn`, once inside `processBulkReturns`'s loop.
Whatever you extract, extracting it once and calling it from both places is the point; leaving
the other two decisions duplicated is not a mistake, it's a choice about which pressure you
are relieving first.

</details>

<details>
<summary>Does it matter which one I pick?</summary>

Act 2 will tell you. Nothing in act 1 says which of the three pressures is about to move
again - that's the whole exercise.

</details>

## Reading

- Fowler, *Refactoring* — the "Duplicated Code" and "Divergent Change" smells describe what's
  wrong here better than any pattern name would.
- [`docs/NAMING.md`](../../../docs/NAMING.md) is worth a pass before you name whatever you
  extract.
