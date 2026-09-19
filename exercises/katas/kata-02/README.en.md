[🌐 English](./README.en.md)

# Ravensgate rate-shopping engine

`Kata` · ~45 min · no tests included

## Context

Every shipment Ravensgate books gets quoted by whichever carriers will even take it, and the
cheapest eligible quote wins. The same logic runs one shipment at a time, at the counter, and
once a night in a single pass over everything queued that day.

## This kata ships with no tests

`src/` has no `tests/` directory, and this one isn't an oversight: **writing the safety net is
the first half of the exercise.** Read `src/rate-shopping.ts` before you touch anything, write
characterisation tests that pin down what it actually does today (Fowler, *Refactoring*, ch. 4),
then restructure underneath your own net exactly as act 1 asks.

`./dp test kata-02 --coverage` is the gate for this half: it measures how much of `src/` your
tests actually exercise, not whether the repository is healthy. Green there is *your* claim, not
a fact this repo asserts about itself.

## The pressure

`pickCheapestCarrier` and `pickCheapestForBatch` each decide, independently, whether a carrier
is even in the running (by destination zone and by weight), whether it's fast enough, and what
it actually charges after its own negotiated discount. None of the three is obviously the one to
fix: eligibility varies by carrier and zone, the weight cap varies by carrier, the discount
varies by carrier. Pick one to restructure and the other two stay exactly as duplicated as they
are today.

## Done when (act 1)

- Your own tests (written before you restructure) are green throughout, against your `src/`.
- `pickCheapestCarrier`, `pickCheapestForBatch` and every field on `RateDecision` behave exactly
  as they do today. This is a restructuring, not a rewrite.
- Your `git log --oneline` shows small steps, each leaving your suite green.

## Then run `./dp act2 kata-02`

## Hints

<details>
<summary>What's worth a characterisation test before I restructure anything?</summary>

Every branch that decides something: which carriers are eligible for which zones, the weight
cap per carrier, the speed-tier filter, the discount per carrier, and the tie-break when two
quotes land on the same total. If you can't say in one sentence what a test is pinning down,
it probably isn't pinning down a branch.

</details>

<details>
<summary>Do eligibility, weight, speed and pricing all have to move together?</summary>

No. Nothing says all four decisions have to be restructured in the same commit, or even in the
same way. Pick the one pressure that bothers you most and leave the others alone - that is a
legitimate, complete answer to act 1.

</details>

<details>
<summary>Does it matter which one I pick?</summary>

Act 2 will tell you. Nothing in act 1 says which of these decisions is about to move again -
that's the whole exercise.

</details>

## Reading

- Fowler, *Refactoring* — chapter 4 (characterisation tests, the safety net you write before
  you touch legacy behaviour) and the "Duplicated Code" / "Divergent Change" smells, which
  describe what's wrong here better than any pattern name would.
- [`docs/NAMING.md`](../../../docs/NAMING.md) is worth a pass before you name whatever you
  extract.
