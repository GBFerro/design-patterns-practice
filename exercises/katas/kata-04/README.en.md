[🌐 English](./README.en.md)

# Ravensgate invoice and surcharge engine

`Kata` · ~45 min · no tests included

## Context

A completed order becomes an invoice: each order line turns into an invoice line, whatever
surcharges apply get added, and whoever needs to hear about the result gets notified. The same
logic also runs once a night, in a single pass over every order finalized that day.

## This kata ships with no tests

`src/` has no `tests/` directory, and this one isn't an oversight: **writing the safety net is
the first half of the exercise.** Read `src/invoicing.ts` before you touch anything, write
characterisation tests that pin down what it actually does today (Fowler, *Refactoring*, ch. 4),
then restructure underneath your own net exactly as act 1 asks.

`./dp test kata-04 --coverage` is the gate for this half: it measures how much of `src/` your
tests actually exercise, not whether the repository is healthy. Green there is *your* claim, not
a fact this repo asserts about itself.

## The pressure

`finalizeInvoice` and `finalizeInvoiceBatch` each make three unrelated decisions,
independently of one another: what an order line becomes on the invoice (by kind), which
surcharges apply (by order flag), and who gets notified (by total). These aren't three flavors
of the same decision - one is about construction, one is about a rate that varies, one is about
fan-out after the fact - which is exactly why none of the three is obviously the one to fix.
Pick one to restructure and the other two stay exactly as duplicated as they are today.

## Done when (act 1)

- Your own tests (written before you restructure) are green throughout, against your `src/`.
- `finalizeInvoice`, `finalizeInvoiceBatch` and every field on `Invoice` behave exactly as they
  do today. This is a restructuring, not a rewrite.
- Your `git log --oneline` shows small steps, each leaving your suite green.

## Then run `./dp act2 kata-04`

## Hints

<details>
<summary>What's worth a characterisation test before I restructure anything?</summary>

Each line kind's own rule (standard, bundle, serviceFee), how surcharges stack when more than
one applies, and the exact totals at which a notification channel turns on or off. If you can't
say in one sentence what a test is pinning down, it probably isn't pinning down a branch.

</details>

<details>
<summary>Do line construction, surcharges and notification all have to move together?</summary>

No. Nothing says all three have to be restructured in the same commit, or even in the same way.
Pick the one pressure that bothers you most and leave the other two alone - that is a
legitimate, complete answer to act 1.

</details>

<details>
<summary>Does it matter which one I pick?</summary>

Act 2 will tell you. Nothing in act 1 says which of these three decisions is about to move
again - that's the whole exercise.

</details>

## Reading

- Fowler, *Refactoring* — chapter 4 (characterisation tests, the safety net you write before
  you touch legacy behaviour) and the "Duplicated Code" / "Divergent Change" smells, which
  describe what's wrong here better than any pattern name would.
- [`docs/NAMING.md`](../../../docs/NAMING.md) is worth a pass before you name whatever you
  extract.
