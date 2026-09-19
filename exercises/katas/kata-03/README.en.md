[🌐 English](./README.en.md)

# Ravensgate warehouse robot command stream

`Kata` · ~45 min

## Context

A warehouse robot processes commands as they arrive: move one cell, pick up an item, drop off
whatever it's holding. The same three commands also get replayed in batches from a persisted
log - and when a command partway through a batch turns out to be illegal, every command already
applied in that batch has to be undone, in reverse order, before the batch reports what failed.
An operator's undo button uses the same one-command-at-a-time reversal, just for a single step.

## The pressure

`runCommand`, `replayBatch` and `undoLast` each make the same three decisions, independently of
one another: whether a command is even legal from where the robot is and what it's holding,
what the command actually does to the robot's state, and - when something needs reversing -
what command undoes it. None of the three is obviously the one to fix: legality is a business
rule, effect is arithmetic, and the inverse of a command depends on both. Pick one to
restructure and the other two stay exactly as duplicated as they are today.

## Done when (act 1)

- `./dp test kata-03` is green throughout, against your `src/`.
- `runCommand`, `replayBatch` and `undoLast` behave exactly as they do today, including that a
  batch failing partway through rolls back to its starting state. This is a restructuring, not
  a rewrite.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 kata-03`

## Hints

<details>
<summary>Do legality, effect and inverse all have to move together?</summary>

No. Nothing says the three have to be restructured in the same commit, or even in the same way.
Pick the one pressure that bothers you most and leave the other two alone - that is a
legitimate, complete answer to act 1.

</details>

<details>
<summary>What's actually duplicated between the three entry points?</summary>

Every decision, more than once - legality is written out in `runCommand` and again in
`replayBatch`'s forward pass; how a command changes state is written out in `runCommand`,
`replayBatch`'s forward pass, `replayBatch`'s rollback, and `undoLast`; how to invert a command
is written out in `replayBatch`'s rollback and again in `undoLast`. Whatever you extract,
extracting it once and calling it from every site that needs it is the point.

</details>

<details>
<summary>Does it matter which one I pick?</summary>

Act 2 will tell you. Nothing in act 1 says which of these decisions is about to move again -
that's the whole exercise.

</details>

## Reading

- Fowler, *Refactoring* — the "Duplicated Code" and "Divergent Change" smells describe what's
  wrong here better than any pattern name would.
- [`docs/NAMING.md`](../../../docs/NAMING.md) is worth a pass before you name whatever you
  extract.
