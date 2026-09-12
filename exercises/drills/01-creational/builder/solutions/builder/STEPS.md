# The route — one mutable state object, one validation pass in build()

## When to choose this

When a value needs several optional pieces assembled before it is valid,
and at least one business rule spans more than one of those pieces. A
single optional field with no cross-field rule is not under-designed as
a small function with a default; this route earns its keep once a rule
has to be checked no matter which order the caller supplies the pieces
in - which is exactly when checking it inside each piece's own setter
means checking it more than once.

## What it costs

A caller who wants a quote right now still writes the same chain of
calls - the frozen signature does not change. What changes is under the
hood: one class holding mutable state, instead of a chain of small
immutable drafts each closed over the last. Two references to the same
in-progress draft can now see each other's writes, which a persistent
draft never allowed.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Introduce `QuoteState` | One interface, every field the draft needs - required and optional alike. | `refactor: introduce QuoteState` |
| 2 | Write the `QuoteBuilder` class shell | Constructor takes a `QuoteState`; implements `QuoteDraft`. No method bodies validate yet. | `refactor: introduce QuoteBuilder` |
| 3 | Move each stage to a one-line mutation | `applyRush`, `applyDiscount`, `setProofRequired`, `setDeliveryMethod` each set one field on `this.state` and `return this` - no checks. | `refactor: route the four stages through one mutable state object` |
| 4 | Move every check into `build()` | The discount/rush check, the courier/quantity check - both land here, checked once, after every field has its value. | `refactor: centralize validation in build()` |
| 5 | Rewrite `build()`'s return | `{ ...this.state, totalCost }` instead of naming every field. | `refactor: spread state into the built quote` |
| 6 | Rewrite `startQuote` | Same signature, opens a `QuoteBuilder` over a state object with every optional field defaulted. | `refactor: open a QuoteBuilder from startQuote` |

Step 3 (stages that mutate and return, with no validation) is checked
against the full suite before step 4 moves any checks - by the time
`build()` gains its first validation line, every stage it depends on is
already a trivial, provably-correct mutation.

## Then

```bash
./dp act2 builder
```

What a fifth stage and a rule spanning it and an old one costs on this
route, and what it would have cost without the pattern, is in
[ACT2.md](./ACT2.md). The full reasoning, with the diagram mapping this
onto the GoF roles, is in [WALKTHROUGH.md](./WALKTHROUGH.md).
