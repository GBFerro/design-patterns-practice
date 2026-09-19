[🌐 English](./README.en.md)

# Ravensgate legacy WMS integration

`Kata` · ~45 min · no tests included

## Context

Ravensgate's warehouse still runs on the same on-prem Warehouse Management System it opened
with: a nightly file export and a polling change-feed, both speaking a record format nobody
has touched in years - fixed-width status codes, a zero-padded quantity string, a bin code
packed into one field, a positional timestamp. Two things in this codebase read that format
and turn it into the clean shape the rest of the app expects: the nightly full-file import,
and the real-time change-feed listener.

## This kata ships with no tests

`src/` has no `tests/` directory, and this one isn't an oversight: **writing the safety net is
the first half of the exercise.** Read `src/wms-sync.ts` before you touch anything, write
characterisation tests that pin down what it actually does today (Fowler, *Refactoring*, ch. 4),
then restructure underneath your own net exactly as act 1 asks.

`./dp test kata-05 --coverage` is the gate for this half: it measures how much of `src/` your
tests actually exercise, not whether the repository is healthy. Green there is *your* claim, not
a fact this repo asserts about itself.

## The pressure

`syncInventorySnapshot` and `applyChangeFeedEvent` each translate a `LegacyWmsRecord` into an
`InventoryRecord` the same way, independently: map the status code, split the bin code into
aisle/shelf/bin, parse the packed timestamp, parse the zero-padded quantity. Every rule lives
twice, once per entry point, and nothing about this pressure hints at what should replace it -
that part is entirely up to you.

## Done when (act 1)

- Your own tests (written before you restructure) are green throughout, against your `src/`.
- `syncInventorySnapshot`, `applyChangeFeedEvent` and every field on `InventoryRecord` behave
  exactly as they do today. This is a restructuring, not a rewrite.
- Your `git log --oneline` shows small steps, each leaving your suite green.

## Then run `./dp act2 kata-05`

## Hints

<details>
<summary>What's worth a characterisation test before I restructure anything?</summary>

Every status code's mapping, a malformed bin code, an unrecognised status code, and that both
entry points agree on the same input. If you can't say in one sentence what a test is pinning
down, it probably isn't pinning down a branch.

</details>

<details>
<summary>Do I need a class, an interface, a pattern name - something structured?</summary>

Nobody's answered that question for you here, and this README isn't going to. Ask what the
actual pressure is asking for, not what the domain sounds like it should use.

</details>

<details>
<summary>Does it matter what I pick?</summary>

Act 2 will tell you. This kata, like the others, doesn't say in advance which restructuring
pays for itself - only what changes today, and what doesn't.

</details>

## Reading

- Fowler, *Refactoring* — chapter 4 (characterisation tests, the safety net you write before
  you touch legacy behaviour) and the "Duplicated Code" smell, which describes what's wrong
  here better than any pattern name would.
- [`docs/NAMING.md`](../../../docs/NAMING.md) is worth a pass before you name whatever you
  extract.
